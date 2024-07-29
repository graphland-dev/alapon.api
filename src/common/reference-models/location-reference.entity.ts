import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@ObjectType()
@Schema({ timestamps: true })
export class LocationReference {
  @Field(() => Float, { nullable: true })
  @Prop()
  lat: number;

  @Field(() => Float, { nullable: true })
  @Prop()
  lng: number;

  @Field(() => String, { nullable: true })
  @Prop()
  caption: string;
}

@InputType()
export class LocationReferenceInput {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  lat: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  lng: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  caption: string;
}
