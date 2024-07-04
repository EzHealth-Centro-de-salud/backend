import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class UpdatePatientInput {
  @IsNotEmpty()
  @Field()
  id_patient: number;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  region: string;

  @Field({ nullable: true })
  commune: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  is_active: boolean;
}

@InputType()
export class UpdatePersonnelInput {
  @IsNotEmpty()
  @Field()
  id_personnel: number;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;
}
