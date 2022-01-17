import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.gql-guard';
import { GqlUser } from 'src/auth/decorator/gql-user.decorator';
import { BoardsService } from './boards.service';
import { BoardStatus } from '@prisma/client';
import { CreateBoardInput } from './dto/create-board.input';
import { BoardStatusValidationPipe } from './pipe/board-status-validation.pipe';
import { User } from '@prisma/client'
import { Board } from './boards.model';

@Resolver('Boards')
@UseGuards(GqlAuthGuard)
export class BoardsResolver {
    constructor(private readonly boardsService: BoardsService) {};

    @Mutation(() => Board)
    createBoard(
        @GqlUser() user: User,
        @Args('title') title: string,
        @Args('description') description: string
    ) {
        const createBoardDto: CreateBoardInput = { title, description };
        return this.boardsService.createBoard(user, createBoardDto);
    }

    @Query(() => [Board])
    getAllBoards() {
        return this.boardsService.getAllBoards();
    }

    @Query(() => [Board])
    getAllMyBoards(@GqlUser() user: User) {
        return this.boardsService.getAllMyBoards(user);
    }

    @Query(() => Board)
    getBoardById(@Args('id', ParseIntPipe) id: number) {
        return this.boardsService.getBoardById(id);
    }

    @Mutation(() => Board)
    updateBoardStatus(
        @Args('id', ParseIntPipe) id: number,
        @Args('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }

    @Mutation(() => Boolean)
    deleteBoard(
        @GqlUser() user: User,
        @Args('id') id: number,
    ) {
        return this.boardsService.deleteBoard(user, id);
    }
}
