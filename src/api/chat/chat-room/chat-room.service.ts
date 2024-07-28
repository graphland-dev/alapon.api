import { UserService } from '@/api/identity/user/user.service';
import { IAuthUser } from '@/authorization/decorators/user.decorator';
import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';
import { slugify } from '@/common/utils/slug';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddOrRemoveGroupModeratorInput,
  CreateChatGroupInput,
  GroupMemberMutationInput,
  JoinOrLeaveGroupInput,
} from './dto/chat-room.input';
import { ChatRoom, ChatRoomType } from './entities/chat-room.entity';

@Injectable()
export class ChatRoomService extends BaseDatabaseRepository<ChatRoom> {
  constructor(
    @InjectModel(ChatRoom.name)
    public readonly chatRoomModel: Model<ChatRoom>,
    private readonly userService: UserService,
  ) {
    super(chatRoomModel);
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
      ],
      {
        members: { $in: [user?.sub] },
      },
    );
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

    // TODO: send system message to room
    // Message: Group created by {user.handle}

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
      .select('_id');

    const res = await this.chatRoomModel.updateOne(
      { handle: input.groupHandle },
      {
        $addToSet: {
          moderators: { $each: handleUsers.map((user) => user._id) },
          members: handleUsers.map((user) => user._id),
        },
      },
    );

    // TODO: send system message to room

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
      .select('_id');

    const res = await this.chatRoomModel.updateOne(
      { handle: slugify(input.groupHandle) },
      {
        $pullAll: {
          moderators: handleUsers.map((user) => user._id),
          members: handleUsers.map((user) => user._id),
        },
      },
    );

    // TODO: send system message to room

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

      return res.modifiedCount > 0;
    } else {
      throw new ForbiddenException('You are not belong to this group');
    }
  }

  async removeMembersFromGroup(
    input: GroupMemberMutationInput,
    user: IAuthUser,
  ) {
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
        .select('_id');

      const res = await this.chatRoomModel.updateOne(
        { handle: slugify(input.groupHandle) },
        {
          $pullAll: {
            members: { $each: handleUsers.map((user) => user._id) },
          },
        },
      );
      // TODO: send system message to room
      return res.modifiedCount > 0;
    } else {
      throw new ForbiddenException(
        'You are not the owner/moderator of this group',
      );
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
        .select('_id');

      const res = await this.chatRoomModel.updateOne(
        { handle: input.groupHandle },
        {
          $pullAll: {
            kickedUsers: handleUsers.map((user) => user._id),
          },
        },
      );
      // TODO: send system message to room
      // TODO: send system message to room
      // input.memberHandles[].handle has been unbanned by @user.handle
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
        .select('_id');

      const res = await this.chatRoomModel.updateOne(
        { handle: input.groupHandle },
        {
          $addToSet: {
            kickedUsers: { $each: handleUsers.map((user) => user._id) },
          },
        },
      );
      // TODO: send system message to room
      // input.memberHandles[].handle has been kicked by @user.handle
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

    return res.modifiedCount > 0;
  }

  async leaveGroup(input: JoinOrLeaveGroupInput, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({
      handle: slugify(input.groupHandle),
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

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
      { handle: slugify(input.groupHandle) },
      {
        $pullAll: {
          members: handleUsers.map((user) => user._id),
        },
      },
    );
    // TODO: send system message to room
    // user.handle leaved @input.groupHandle

    return res.modifiedCount > 0;
  }
}
