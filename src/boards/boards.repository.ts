import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Board } from "./boards.entity";
import { BoardStatus } from "./boards.status";
import { CreateBoardDto } from "./dto/create-board.dto";

@EntityRepository(Board)
export class BoardsRepository extends Repository<Board> {
    
    async createBoard(user: User, createBoardDto: CreateBoardDto): Promise <Board> {
        const { title, description } = createBoardDto;
        const board = this.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user,
        })
    
        await this.save(board);
        return board;
    }
}