import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class CheckScheduleInput {
  @IsNotEmpty()
  @Field()
  id_personnel: number;

  @IsNotEmpty()
  @Field()
  date: string;
}
