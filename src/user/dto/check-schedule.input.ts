import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class CheckScheduleInput {
  @IsNotEmpty()
  @Field(() => Int)
  id_personnel: number;

  @IsNotEmpty()
  @Field()
  date: string;
}
