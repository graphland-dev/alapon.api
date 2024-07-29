import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';

@ObjectType()
@Schema({ timestamps: true, collection: 'common__LocationReference' })
export class LocationReference {
  @Field(() => String, { nullable: true })
  @Prop()
  caption: string;

  @Field(() => Number, { nullable: true })
  @Prop()
  latitude: number;

  @Field(() => Number, { nullable: true })
  @Prop()
  longitude: number;
}

@InputType()
export class LocationReferenceInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  caption: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  latitude: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  longitude: number;
}
