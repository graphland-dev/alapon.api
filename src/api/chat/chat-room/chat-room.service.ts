import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as slug from 'slug';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom, ChatRoomType } from './entities/chat-room.entity';
import { IAuthUser } from '@/authorization/decorators/user.decorator';
import {
  AddOrRemoveGroupMembersInput,
  AddOrRemoveGroupModeratorInput,
  CreateChatGroupInput,
} from './dto/chat-room.input';
import { UserService } from '@/api/identity/user/user.service';

@Injectable()
export class ChatRoomService extends BaseDatabaseRepository<ChatRoom> {
  constructor(
    @InjectModel(ChatRoom.name)
    public readonly chatRoomModel: Model<ChatRoom>,
    private readonly userService: UserService,
  ) {
    super(chatRoomModel);
  }

  async createGroup(input: CreateChatGroupInput, user: IAuthUser) {
    const _room = await this.chatRoomModel.findOne({
      handle: slug(input?.handle, '_'),
    });
    if (_room) throw new BadRequestException('Group handle already taken');

    const res = await this.chatRoomModel.create({
      ...input,
      handle: slug(input?.handle, '_'),
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
      handle: input.groupHandle,
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
      handle: input.groupHandle,
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
        $pullAll: {
          moderators: handleUsers.map((user) => user._id),
          members: handleUsers.map((user) => user._id),
        },
      },
    );

    // TODO: send system message to room

    return res.modifiedCount > 0;
  }

  async addMembersToGroup(
    input: AddOrRemoveGroupMembersInput,
    user: IAuthUser,
  ) {
    const _room = await this.chatRoomModel.findOne({
      handle: input.groupHandle,
      roomType: ChatRoomType.GROUP,
    });

    if (!_room) throw new NotFoundException('Invalid group handle');

    if (
      _room.owner.toString() == user.sub ||
      _room.members.map((member) => member.toString()).includes(user.sub)
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
    input: AddOrRemoveGroupMembersInput,
    user: IAuthUser,
  ) {
    const _room = await this.chatRoomModel.findOne({
      handle: input.groupHandle,
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
}
