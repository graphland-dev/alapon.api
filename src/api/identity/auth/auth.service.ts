import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JoinUserInput, LoginInput, ResetPinInput } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { UserAccountStatus } from '../user/entities/user.entity';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ReferenceRequestService } from '../reference-request/reference-request.service';
import { ReferenceRequestStatus } from '../reference-request/entities/reference-request.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectConnection()
    private readonly mongooseConnection: mongoose.Connection,
    public readonly referenceRequestService: ReferenceRequestService,
  ) {}

  async loginUser(input: LoginInput) {
    // check if user exists
    const user = await this.userService.userModel.findOne({
      handle: input.handle,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if pin is correct
    if (user.pin !== input.pin) {
      throw new NotFoundException('Pin is incorrect');
    }

    if (user.accountStatus !== UserAccountStatus.ACTIVE) {
      throw new ForbiddenException('Account is not active yet');
    }
    return {
      token: jwt.sign(
        {
          handle: user?.handle,
          accountStatus: user?.accountStatus,
        },
        process.env.JWT_SECRET,
        {
          subject: user?._id.toString(),
          issuer: 'backout.app',
          audience: 'backout.app',
        },
      ),
    };
  }

  async resetPin(input: ResetPinInput) {
    // check if user exists
    const user = await this.userService.userModel.findOne({
      handle: input.handle,
    });
    if (!user) {
      throw new ForbiddenException('Invalid secret or handle');
    }

    // check if secret is correct
    if (user.secret !== input.secret) {
      throw new ForbiddenException('Invalid secret or handle');
    }

    // change pin
    user.pin = input.pin;
    await user.save();

    return true;
  }

  async joinUser(input: JoinUserInput) {
    if (input.handle === input.referenceHandle)
      throw new BadRequestException(
        'Handle and reference handle cannot be same',
      );

    // check handle is available
    const user = await this.userService.userModel.findOne({
      handle: input.handle,
    });
    if (user) throw new BadRequestException('Handle is already taken');

    // check referenceHandle is available
    const referenceUser = await this.userService.userModel.findOne({
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
      const createdUser = await this.userService.createOne({
        ...input,
        secret,
      });

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
