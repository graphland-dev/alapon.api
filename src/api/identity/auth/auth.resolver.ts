import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, LoginResponse } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse, {
    name: 'identity__login',
  })
  createAuth(@Args('input') input: LoginInput) {
    return this.authService.loginUser(input);
  }
}
