import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom, ChatRoomType } from './entities/chat-room.entity';
import { IAuthUser } from '@/authorization/decorators/user.decorator';
import {
  AddOrRemoveGroupMembersInput,
  AddOrRemoveGroupModeratorInput,
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

      return res.modifiedCount > 0;
    } else {
      throw new ForbiddenException(
        'You are not the owner/moderator of this group',
      );
    }
  }
}
