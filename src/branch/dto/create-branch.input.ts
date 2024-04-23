import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBranchInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
