import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMedicalRecordInput {
  @IsNotEmpty()
  @Field(() => Int)
  id_appointment: number;

  @IsNotEmpty()
  @Field(() => Int)
  id_personnel: number;

  @IsNotEmpty()
  @Field()
  diagnosis: string;

  @IsNotEmpty()
  @Field()
  prescription: string;
}
