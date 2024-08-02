import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class JoinUserInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  handle: string;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  referenceHandle: string;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pin: string;
}

export class CreateUserByAdmin {
  @ApiProperty()
  @IsNotEmpty()
  handle: string;

  @Field(() => String)
  @ApiProperty()
  @IsOptional()
  referenceHandle: string;

  @Field(() => String)
  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  @MaxLength(6)
  pin: string;
}
