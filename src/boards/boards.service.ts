import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsRepository } from './boards.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { BoardStatus } from './boards.status';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardsRepository: BoardsRepository
    ) {}

    async createBoard(user: User, createBoardDto: CreateBoardDto): Promise <Board> {
        return this.boardsRepository.createBoard(user, createBoardDto);
    }

    async getAllBoards(): Promise<Board[]> {
        return this.boardsRepository.find();
    }

    async getAllMyBoards(user: User): Promise<Board[]> {
        const query = this.boardsRepository.createQueryBuilder('board');
        query.where('board.userId = :userId', {userId: user.id});

        const boards = await query.getMany();
        return boards;
    }

    async getBoardById(id: number): Promise <Board> {
        const found = await this.boardsRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return found;
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);
        board.status = status;
        await this.boardsRepository.save(board);
        return board;
    }

    async deleteBoard(user: User, id: number): Promise<Object> {
        try {
            const result = await this.boardsRepository.delete({id, user});
            return { deleted: true };
        } catch(error) {
            return { deleted: false, message: error.message}
        }
    }
}
