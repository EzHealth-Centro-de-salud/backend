import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateBoxInput {
  @IsNotEmpty()
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  box: number;

  @Field(() => Int, { nullable: true })
  is_active: boolean;
}
