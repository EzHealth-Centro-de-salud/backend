import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RescheduleAppointmentInput {
  @IsNotEmpty()
  @Field(() => Int)
  id_appointment: number;

  @IsNotEmpty()
  @Field()
  date: string;

  @IsNotEmpty()
  @Field()
  time: string;
}
