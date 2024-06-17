import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CancelAppointmentInput {
  @IsNotEmpty()
  @Field(() => Int)
  id_appointment: number;

  @Field(() => Int, { nullable: true })
  id_patient: number;

  @Field(() => Int, { nullable: true })
  id_personnel: number;
}
