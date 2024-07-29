import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class JoinUserResponse {
  @Field(() => String)
  @IsNotEmpty()
  secret: string;
}
