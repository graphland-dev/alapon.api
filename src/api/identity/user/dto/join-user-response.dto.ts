import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class JoinUserResponse {
  @Field(() => String)
  @IsNotEmpty()
  secret: string;
}
