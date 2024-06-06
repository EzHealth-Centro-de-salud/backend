import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAppointmentInput {
  @IsNotEmpty()
  @Field()
  date: string;

  @IsNotEmpty()
  @Field()
  time: string;

  @IsNotEmpty()
  @Field()
  type: string;

  @IsNotEmpty()
  @Field(() => Int)
  id_patient: number;

  @IsNotEmpty()
  @Field(() => Int)
  id_personnel: number;
}
