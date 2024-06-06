import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBoxInput {
  @IsNotEmpty()
  @Field(() => Int)
  id_branch: number;

  @IsNotEmpty()
  @Field(() => Int)
  box: number;
}
