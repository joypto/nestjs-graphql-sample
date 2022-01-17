import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AuthCredentialInput {
    @Field()
    username: string;
    @Field()
    password: string;
}