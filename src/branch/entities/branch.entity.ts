import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Branch {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
