import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChatRoomInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
