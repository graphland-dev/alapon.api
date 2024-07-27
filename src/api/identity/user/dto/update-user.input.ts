import { JoinUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(JoinUserInput) {
  @Field(() => Int)
  id: number;
}
