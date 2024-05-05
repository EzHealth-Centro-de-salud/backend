import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class CreatePatientInput {
  @IsNotEmpty()
  @Field()
  rut: string;

  @IsNotEmpty()
  @Field()
  password: string;

  @IsNotEmpty()
  @Field()
  birthdate: string;

  @IsNotEmpty()
  @Field()
  first_name: string;

  @Field({ nullable: true })
  middle_name: string | null;

  @IsNotEmpty()
  @Field()
  surname: string;

  @Field({ nullable: true })
  second_surname: string | null;

  @IsNotEmpty()
  @Field()
  sex: string;

  @IsNotEmpty()
  @Field()
  address: string;

  @IsNotEmpty()
  @Field()
  region: string;

  @IsNotEmpty()
  @Field()
  commune: string;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  phone: string;
}

@InputType()
export class CreatePersonnelInput {
  @IsNotEmpty()
  @Field()
  rut: string;

  @IsNotEmpty()
  @Field()
  password: string;

  @IsNotEmpty()
  @Field()
  first_name: string;

  @Field({ nullable: true })
  middle_name: string | null;

  @IsNotEmpty()
  @Field()
  surname: string;

  @Field({ nullable: true })
  second_surname: string | null;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  role: string;

  @IsNotEmpty()
  @Field()
  speciality: string;

  @IsNotEmpty()
  @Field()
  id_branch: number;
}
