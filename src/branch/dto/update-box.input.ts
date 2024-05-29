import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateBoxInput {
  @Field()
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  box: number;

  @Field({ nullable: true })
  is_active: boolean;
}
