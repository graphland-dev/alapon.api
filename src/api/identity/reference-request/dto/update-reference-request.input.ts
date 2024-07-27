import { CreateReferenceRequestInput } from './create-reference-request.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReferenceRequestInput extends PartialType(CreateReferenceRequestInput) {
  @Field(() => Int)
  id: number;
}
