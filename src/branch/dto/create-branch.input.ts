import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBranchInput {
  @IsNotEmpty()
  @Field()
  address: string;
}
