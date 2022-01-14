import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.gql-guard';
import { GqlUser } from 'src/auth/decorator/gql-user.decorator';
import { User } from 'src/auth/user.entity';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards.status';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipe/board-status-validation.pipe';

@Resolver('Boards')
@UseGuards(GqlAuthGuard)
export class BoardsResolver {
    constructor(private readonly boardsService: BoardsService) {};

    @Mutation()
    createBoard(
        @GqlUser() user: User,
        @Args('title') title: string,
        @Args('description') description: string
    ) {
        console.log(user);
        const dto = new CreateBoardDto(title, description);
        console.log(dto);
        return this.boardsService.createBoard(user, dto);
    }

    @Query()
    getAllBoards() {
        return this.boardsService.getAllBoards();
    }

    @Query()
    getAllMyBoards(@GqlUser() user: User) {
        return this.boardsService.getAllMyBoards(user);
    }

    @Query()
    getBoardById(@Args('id', ParseIntPipe) id: number) {
        return this.boardsService.getBoardById(id);
    }

    @Mutation()
    updateBoardStatus(
        @Args('id', ParseIntPipe) id: number,
        @Args('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }

    @Mutation()
    deleteBoard(
        @GqlUser() user: User,
        @Args('id') id: number,
    ) {
        return this.boardsService.deleteBoard(user, id);
    }
}
