import { Field, ObjectType, ID } from "@nestjs/graphql";
import { Board } from "src/boards/boards.model";

@ObjectType()
export class User {
    @Field(() => ID)
    id: number;
    username: string;
    password: string;
    boards: Board[];
}