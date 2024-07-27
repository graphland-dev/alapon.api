import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginInput, ResetPinInput } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { UserAccountStatus } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
      token: jwt.sign({ handle: user.handle }, process.env.JWT_SECRET),
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
}
