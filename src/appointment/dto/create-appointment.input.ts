import { Field, InputType } from '@nestjs/graphql';
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
  @Field()
  id_patient: number;

  @IsNotEmpty()
  @Field()
  id_personnel: number;
}
