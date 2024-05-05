import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateBoxInput {
  @IsNotEmpty()
  @Field()
  id_branch: number;

  @IsNotEmpty()
  @Field()
  box: number;
}
