import { UserService } from '@/api/identity/user/user.service';
import { IAuthUser } from '@/authorization/decorators/user.decorator';
import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';
import { slugify } from '@/common/utils/slug';
import { RoomListUpdatedSocketEvent } from '@/socket.io/contracts/RoomListUpdatedSocketEvent';
import { SocketIoGateway } from '@/socket.io/socket.io.gateway';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessageService } from '../chat-message/chat-message.service';
import { ChatMessageType } from '../chat-message/entities/chat-message.entity';
import {
  AddOrRemoveGroupModeratorInput,
  CreateChatGroupInput,
  GroupMemberMutationInput,
  JoinInPersonInput,
  JoinOrLeaveGroupInput,
} from './dto/chat-room.input';
import { ChatRoom, ChatRoomType } from './entities/chat-room.entity';

@Injectable()
export class ChatRoomService extends BaseDatabaseRepository<ChatRoom> {
  constructor(
    @InjectModel(ChatRoom.name)
    public readonly chatRoomModel: Model<ChatRoom>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ChatMessageService))
    public readonly chatMessageService: ChatMessageService,
    @Inject(forwardRef(() => SocketIoGateway))
    private readonly socketIoGateway: SocketIoGateway,
  ) {
    super(chatRoomModel);
  }

  async joinInPerson(input: JoinInPersonInput, authUser: IAuthUser) {
    const _user = await this.userService.userModel.findOne({
      handle: slugify(input.userHandle),
    });
    if (!_user) throw new NotFoundException('Invalid user handle');

    const _room = await this.chatRoomModel.findOne({
      roomType: ChatRoomType.PRIVATE,
      members: { $all: [_user._id, authUser.sub] },
    });
    console.log(_room);
    if (_room) throw new BadRequestException('You are already connected');

    const createdChatRoom = await this.chatRoomModel.create({
      members: [_user._id, authUser.sub],
      roomType: ChatRoomType.PRIVATE,
      owner: authUser?.sub,
    });

    // Send system message to room
    const message = await this.chatMessageService.sendMessageToRoom({
      text: `@${_user.handle} has joined your private chat`,
      roomId: createdChatRoom._id,
      messageType: ChatMessageType.SYSTEM_MESSAGE,
    });

    // Send initial message to room
    await this.chatMessageService.sendMessageToRoom({
      text: input?.messageText,
      roomId: createdChatRoom._id,
      messageType: ChatMessageType.USER_MESSAGE,
      userId: authUser?.sub,
    });

    // send socket message to user
    this.socketIoGateway.sendSocketMessageToUser(
      _user._id,
      `room-list-updated:${_user._id}`,
      new RoomListUpdatedSocketEvent({
        _id: createdChatRoom._id,
        actionType: 'room-added',
        room: {
          ...createdChatRoom.toJSON(),
          lastMessage: {
            _id: message._id,
            text: input?.messageText,
            chatRoom: createdChatRoom._id,
            createdBy: authUser?.sub,
            messageType: ChatMessageType.USER_MESSAGE,
          },
          members: [
            { _id: authUser.sub, handle: authUser.handle },
            { _id: _user._id, handle: _user.handle },
          ],
        },
      }).payload,
    );

    return createdChatRoom;
  }

  myChatRooms(where: CommonPaginationOnlyDto, fields: any, user: IAuthUser) {
    return this.findAllWithPagination(
      where,
      fields,
      [
        { path: 'members' },
        { path: 'moderators' },
        { path: 'owner' },
        { path: 'kickedUsers' },
        { path: 'lastMessage' },
        { path: 'lastMessageSender' },
      ],
      {
        members: { $in: [user?.sub] },
      },
    );
  }

  async roomDetails(roomId: string, fields: string[], authUser: IAuthUser) {
    // TODO: show chat room details with count of members
    const _room = this.chatRoomModel.findOne({
      _id: roomId,
      members: { $in: [authUser.sub] },
    });

    if (fields.length) {
      fields.forEach((field) => {
        _room.populate(field);
      });
      _room.select(fields.join(' '));
    }

    if (!_room)
      throw new BadRequestException(`Room not found or permission denied`);

    return await _room.exec();
  }

  async createGroup(input: CreateChatGroupInput, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input?.handle),
    });
    if (_room) throw new BadRequestException('Group handle already taken');

    const res = await this.chatRoomModel.create({
      ...input,
      handle: slugify(input?.handle),
      members: [user?.sub],
      owner: user?.sub,
      roomType: ChatRoomType.GROUP,
    });

    // Send system message to room
    // Message: Group created by {user.handle}
    await this.chatMessageService.sendMessageToRoom({
      text: `Group created by @${user.handle}`,
      roomId: res._id,
      messageType: ChatMessageType.SYSTEM_MESSAGE,
    });

    return res;
  }

  async addModeratorsToRoom(
    input: AddOrRemoveGroupModeratorInput,
    user: IAuthUser,
  ) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input.groupHandle),
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

    if (_room.owner.toString() !== user.sub)
      throw new ForbiddenException('You are not the owner of this group');

    const handleUsers = await this.userService.userModel
      .find({
        handle: { $in: input.moderatorHandles },
      })
      .select('_id handle');

    const res = await this.chatRoomModel.updateOne(
      { handle: input.groupHandle },
      {
        $addToSet: {
          moderators: { $each: handleUsers.map((user) => user._id) },
          members: handleUsers.map((user) => user._id),
        },
      },
    );

    // Send system message to room
    handleUsers.forEach(async (_user) => {
      await this.chatMessageService.sendMessageToRoom({
        text: `@${_user.handle} has been added as moderator`,
        roomId: _room.id,
        messageType: ChatMessageType.SYSTEM_MESSAGE,
      });
    });

    return res.modifiedCount > 0;
  }

  async removeModeratorsToRoom(
    input: AddOrRemoveGroupModeratorInput,
    user: IAuthUser,
  ) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input.groupHandle),
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

    if (_room.owner.toString() !== user.sub)
      throw new ForbiddenException('You are not the owner of this group');

    const handleUsers = await this.userService.userModel
      .find({
        handle: { $in: input.moderatorHandles },
      })
      .select('_id handle');

    const res = await this.chatRoomModel.updateOne(
      { handle: slugify(input.groupHandle) },
      {
        $pullAll: { moderators: handleUsers.map((user) => user._id) },
      },
    );

    // Send system message to room
    handleUsers.forEach(async (_user) => {
      await this.chatMessageService.sendMessageToRoom({
        text: `@${_user.handle} has been removed as moderator`,
        roomId: _room.id,
        messageType: ChatMessageType.SYSTEM_MESSAGE,
      });
    });

    return res.modifiedCount > 0;
  }

  async addMembersToGroup(input: GroupMemberMutationInput, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input.groupHandle),
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

    if (
      _room.owner.toString() == user.sub ||
      _room.moderators
        .map((moderator) => moderator.toString())
        .includes(user.sub) ||
      _room.members.map((member) => member.toString()).includes(user.sub)
    ) {
      const handleUsers = await this.userService.userModel
        .find({
          handle: { $in: input.memberHandles },
        })
        .select('_id handle');

      const res = await this.chatRoomModel.updateOne(
        { handle: slugify(input.groupHandle) },
        {
          $addToSet: {
            members: { $each: handleUsers.map((user) => user._id) },
          },
        },
      );

      // Send system message to room
      handleUsers.forEach(async (_user) => {
        await this.chatMessageService.sendMessageToRoom({
          text: `@${_user.handle} has been added by @${user.handle}`,
          roomId: _room.id,
          messageType: ChatMessageType.SYSTEM_MESSAGE,
        });

        // send socket message to user
        this.socketIoGateway.sendSocketMessageToUser(
          _user._id,
          `room-list-updated:${_user._id}`,
          new RoomListUpdatedSocketEvent({
            _id: _room.id,
            actionType: 'room-updated',
            room: _room.toJSON(),
          }).payload,
        );
      });

      return res.modifiedCount > 0;
    } else {
      throw new ForbiddenException('You are not belong to this group');
    }
  }

  async unKickGroupMembers(input: GroupMemberMutationInput, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input.groupHandle),
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

    if (
      _room.owner.toString() == user.sub ||
      _room.moderators
        .map((moderator) => moderator.toString())
        .includes(user.sub)
    ) {
      const handleUsers = await this.userService.userModel
        .find({
          handle: { $in: input.memberHandles },
        })
        .select('_id handle');

      const res = await this.chatRoomModel.updateOne(
        { handle: slugify(input.groupHandle) },
        {
          $pullAll: {
            kickedUsers: handleUsers.map((user) => user._id),
          },
        },
      );

      // Send system message to room
      // input.memberHandles[].handle has been kicked by @user.handle
      handleUsers.forEach(async (_user) => {
        await this.chatMessageService.sendMessageToRoom({
          text: `@${_user.handle} has been unbanned by @${user.handle}`,
          roomId: _room.id,
          messageType: ChatMessageType.SYSTEM_MESSAGE,
        });
      });
      return res.modifiedCount > 0;
    } else {
      throw new ForbiddenException(
        'You are not the owner/moderator of this group',
      );
    }
  }

  async kickMembersFromGroup(input: GroupMemberMutationInput, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input.groupHandle),
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

    // TODO: don't allow to kick owner
    if (
      _room.owner.toString() == user.sub ||
      _room.moderators
        .map((moderator) => moderator.toString())
        .includes(user.sub)
    ) {
      const handleUsers = await this.userService.userModel
        .find({
          handle: { $in: input.memberHandles },
        })
        .select('_id handle');

      const res = await this.chatRoomModel.updateOne(
        { handle: input.groupHandle },
        {
          $addToSet: {
            kickedUsers: { $each: handleUsers.map((user) => user._id) },
          },
        },
      );

      // Send system message to room
      // input.memberHandles[].handle has been kicked by @user.handle
      handleUsers.forEach(async (_user) => {
        await this.chatMessageService.sendMessageToRoom({
          text: `@${_user.handle} has been kicked by @${user.handle}`,
          roomId: _room.id,
          messageType: ChatMessageType.SYSTEM_MESSAGE,
        });
      });
      return res.modifiedCount > 0;
    } else {
      throw new ForbiddenException(
        'You are not the owner/moderator of this group',
      );
    }
  }

  async joinGroup(input: JoinOrLeaveGroupInput, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input.groupHandle),
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

    if (_room.members.map((member) => member.toString()).includes(user.sub)) {
      throw new BadRequestException('You are already a member of this group');
    }

    const handleUsers = await this.userService.userModel
      .find({ handle: user.handle })
      .select('_id');

    const res = await this.chatRoomModel.updateOne(
      { handle: slugify(input.groupHandle) },
      {
        $addToSet: {
          members: { $each: handleUsers.map((user) => user._id) },
        },
      },
    );
    // TODO: send system message to room
    // user.handle has been added to @input.groupHandle
    await this.chatMessageService.sendMessageToRoom({
      text: `@${user.handle} joined`,
      roomId: _room.id,
      messageType: ChatMessageType.SYSTEM_MESSAGE,
    });

    return res.modifiedCount > 0;
  }

  async leaveChatRoom(roomId: string, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({ _id: roomId });
    const members = _room.members;
    if (!_room) throw new NotFoundException('Invalid room id');

    if (_room.roomType === ChatRoomType.GROUP) {
      // TODO: don't allow to leave owner
      if (_room.owner.toString() === user.sub)
        throw new BadRequestException(
          'You are the owner of this group, you cannot leave',
        );

      if (
        !Boolean(
          _room.members.map((member) => member.toString()).includes(user.sub),
        )
      ) {
        throw new BadRequestException('You are not a member of this group');
      }

      const handleUsers = await this.userService.userModel
        .find({ handle: user.handle })
        .select('_id');

      const res = await this.chatRoomModel.updateOne(
        { _id: roomId },
        { $pullAll: { members: handleUsers.map((user) => user._id) } },
      );
      // TODO: send system message to room
      await this.chatMessageService.sendMessageToRoom({
        text: `@${user.handle} left`,
        roomId: _room.id,
        messageType: ChatMessageType.SYSTEM_MESSAGE,
      });

      return res.modifiedCount > 0;
    }

    if (_room.roomType === ChatRoomType.PRIVATE) {
      // delete chat room
      await this.chatRoomModel.deleteOne({ _id: roomId });

      // delete all room messages
      await this.chatMessageService.chatMessageModel.deleteMany({
        chatRoom: roomId,
      });

      // send socket message to user
      members.forEach((member) => {
        this.socketIoGateway.sendSocketMessageToUser(
          member._id,
          `room-list-updated:${member}`,
          new RoomListUpdatedSocketEvent({
            _id: _room.id,
            actionType: 'room-removed',
            room: _room.toJSON(),
          }).payload,
        );
      });

      return true;
    }
  }
}
