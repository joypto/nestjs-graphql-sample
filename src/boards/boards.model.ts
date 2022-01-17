import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BoardStatus } from '@prisma/client';
import { User } from "src/auth/user.model";

@ObjectType()
export class Board {
    @Field(() => ID)
    id: number;
    @Field()
    title: string;
    @Field()
    description: string;
    @Field()
    status: BoardStatus;

    user: User
}