import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardStatus } from './boards.status';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './boards.entity';
import { BoardStatusValidationPipe } from './pipe/board-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    private readonly logger = new Logger('BoardController');
    constructor(private boardsSerivce: BoardsService) {}

    @Post('/')
    @UsePipes(ValidationPipe)
    createBoard(
        @GetUser() user: User,
        @Body() createBoardDto: CreateBoardDto
        ): Promise <Board> {
        this.logger.verbose(`User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`);
        return this.boardsSerivce.createBoard(user, createBoardDto);
    }

    @Get('/')
    getAllBoards(): Promise<Board[]> {
        return this.boardsSerivce.getAllBoards();
    }

    @Get('/me')
    getAllMyBoards(
        @GetUser() user: User,
    ): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsSerivce.getAllMyBoards(user);
    }

    @Get('/:id')
    getBoardById(@Param('id', ParseIntPipe) id: number): Promise <Board> {
        return this.boardsSerivce.getBoardById(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<Board> {
        return this.boardsSerivce.updateBoardStatus(id, status);
    }

    @Delete('/:id')
    deleteBoard(
        @GetUser() user: User,
        @Param('id') id: number
        ): Promise<void> {
        return this.boardsSerivce.deleteBoard(user, id);
    }
}
