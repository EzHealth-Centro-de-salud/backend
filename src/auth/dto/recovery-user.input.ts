import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RecoveryUserInput {
  @IsNotEmpty()
  @Field()
  rut: string;
}

@InputType()
export class ValidateRecoveryUserInput {
  @IsNotEmpty()
  @Field((type) => Int)
  recoveryPass: number;
}

@InputType()
export class ChangePasswordInput {
  @IsNotEmpty()
  @Field()
  rut: string;

  @IsNotEmpty()
  @Field()
  newPassword: string;
}
