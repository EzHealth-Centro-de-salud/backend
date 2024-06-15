import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateBranchInput {
  @IsNotEmpty()
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  is_active: boolean;
}
