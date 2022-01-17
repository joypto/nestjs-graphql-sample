import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardInput } from './dto/create-board.input';
import { PrismaService } from 'nestjs-prisma';
import { User, BoardStatus } from '@prisma/client'

@Injectable()
export class BoardsService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createBoard(user: User, createBoardInput: CreateBoardInput) {
        const { title, description } = createBoardInput;
        return this.prisma.board.create({
            data: {
                title,
                description,
                status: BoardStatus.PUBLIC,
                userId: user.id,
            }
        });
    }

    async getAllBoards() {
        return this.prisma.board.findMany();
    }

    async getAllMyBoards(user: User) {
        return this.prisma.board.findMany({
            where: {
                user,
            },
        });
    }

    async getBoardById(id: number) {
        const found = await this.prisma.board.findUnique({
            where: {
                id,
            },
        });
        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }

    async updateBoardStatus(id: number, status: BoardStatus) {
        const board = await this.prisma.board.update({
            where: {
                id,
            },
            data: {
                status: BoardStatus.PRIVATE,
            },
        });
        return board;
    }

    async deleteBoard(user: User, id: number) {
        try {
            const result = await this.prisma.board.delete({
                where: {
                    id,
                },
            });

            if (result == null) {
                throw new NotFoundException(`Can't find Board with id = ${id}, userId = ${user.id}`);
            }
            return true;
        } catch(error) {
            return false;
        }
    }
}
