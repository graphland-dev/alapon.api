import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateReferenceRequestInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
