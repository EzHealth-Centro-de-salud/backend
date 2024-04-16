import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class LoginInput {
    @IsNotEmpty()
    @Field()
    rut: string;

    @IsNotEmpty()
    @Field()
    password: string;
}