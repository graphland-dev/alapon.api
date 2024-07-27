import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { JoinUserInput } from './dto/create-user.input';
import { ReferenceRequestService } from '../reference-request/reference-request.service';
import { ReferenceRequestStatus } from '../reference-request/entities/reference-request.entity';

@Injectable()
export class UserService extends BaseDatabaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    public readonly userModel: Model<User>,
    public readonly referenceRequestService: ReferenceRequestService,
    @InjectConnection()
    private readonly mongooseConnection: mongoose.Connection,
  ) {
    super(userModel);
  }

  async joinUser(input: JoinUserInput) {
    if (input.handle === input.referenceHandle)
      throw new BadRequestException(
        'Handle and reference handle cannot be same',
      );

    // check handle is available
    const user = await this.userModel.findOne({ handle: input.handle });
    if (user) throw new BadRequestException('Handle is already taken');

    // check referenceHandle is available
    const referenceUser = await this.userModel.findOne({
      handle: input.referenceHandle,
    });

    if (!referenceUser)
      throw new BadRequestException('Reference handle is invalid');

    // start transaction
    const session = await this.mongooseConnection.startSession();

    try {
      session.startTransaction();
      const secret = crypto.randomUUID();

      // create user
      const createdUser = await this.createOne({ ...input, secret });

      // create reference request
      await this.referenceRequestService.createOne({
        requesterUser: createdUser._id,
        referenceUser: referenceUser._id,
        status: ReferenceRequestStatus.PENDING,
      });

      // commit transaction
      await session.commitTransaction();
      return { secret };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
}
