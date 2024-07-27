import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, LoginResponse, ResetPinInput } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse, {
    name: 'identity__login',
  })
  createAuth(@Args('input') input: LoginInput) {
    try {
      return this.authService.loginUser(input);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, {
    name: 'identity__resetPin',
  })
  resetPin(@Args('input') input: ResetPinInput) {
    try {
      return this.authService.resetPin(input);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
