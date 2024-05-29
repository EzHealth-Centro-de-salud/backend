import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateBranchInput {
  @Field()
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  is_active: boolean;
}
