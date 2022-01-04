import { Test, TestingModule } from "@nestjs/testing";
import { User } from "src/auth/user.entity";
import { BoardsController } from "./boards.controller"
import { Board } from "./boards.entity";
import { BoardsService } from "./boards.service";
import { BoardStatus } from "./boards.status";
import { CreateBoardDto } from "./dto/create-board.dto";

describe('BoardsController', () => {
    let controller: BoardsController;
    let service: BoardsService;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardsController],
            providers: [
                {
                    provide: BoardsService,
                    useValue: {
                        createBoard: jest.fn().mockImplementation((user: User, dto: CreateBoardDto) =>
                            Promise.resolve({ id: 1, ...dto, status: BoardStatus.PUBLIC, user }),
                        ),
                        getAllBoards: jest.fn().mockResolvedValue([
                            { id: 1, title: '제목', description: '내용', status: BoardStatus.PUBLIC },
                            { id: 2, title: '제목2', description: '내용2', status:  BoardStatus.PRIVATE },
                        ]),
                        getAllMyBoards: jest.fn().mockImplementation((user: User) => 
                            Promise.resolve([
                                { id: 1, title: '제목', description: '내용', status: BoardStatus.PUBLIC },
                            ])
                        ),
                        getBoardById: jest.fn().mockImplementation((id: number) =>
                            Promise.resolve({ id , title: '제목', description: '내용', status: BoardStatus.PUBLIC })
                        ),
                        updateBoardStatus: jest.fn().mockImplementation((id: number, status: BoardStatus) =>
                            Promise.resolve({ id, title: '제목', description: '내용', status }),
                        ),
                        deleteBoard: jest.fn().mockResolvedValue({ deleted: true }),
                    }
                },
            ],
        }).compile();

        controller = module.get<BoardsController>(BoardsController);
        service = module.get<BoardsService>(BoardsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createBoard', () => {
        const user: User = new User( 'joychae', '1234', [] );
        const dto: CreateBoardDto = { title: '제목', description: '내용'};
        it('should return a new board', async() => { 
            await expect(controller.createBoard(user, dto)).resolves.toEqual({
                id: 1,
                ...dto,
                status: BoardStatus.PUBLIC,
                user: user,
            });
        });
    })

    describe('getAllBoards', () => {
        it('should return all boards', async() => {
            await expect(controller.getAllBoards()).resolves.toEqual([
                { id: 1, title: '제목', description: '내용', status: BoardStatus.PUBLIC },
                { id: 2, title: '제목2', description: '내용2', status:  BoardStatus.PRIVATE }, 
            ]);
        });
    });

    describe('getAllMyBoards', () => {    
        it('should return all boards written by specific user', async() => {
            let user: User = new User( 'joychae', '1234', []);
            const board: Board = new Board('제목', '내용', BoardStatus.PUBLIC, user);
            user.boards.push(board);

            await expect(controller.getAllMyBoards(user)).resolves.toEqual([
                { id: 1, title: '제목', description: '내용', status: BoardStatus.PUBLIC },
            ]);
        });
    });

    describe('getBoardById', () => {
        it('should return a board by id', async() => {
            const id: number = 1;
            await expect(controller.getBoardById(id)).resolves.toEqual(
                { id: 1, title: '제목', description: '내용', status: BoardStatus.PUBLIC },
            );
        });
    });

    describe('updateBoardStatus', () => {
        it('should return updated status of a board', async() => {
            const id: number = 1;
            const status: BoardStatus = BoardStatus.PRIVATE;
            await expect(controller.updateBoardStatus(id, status)).resolves.toEqual(
                { id: 1, title: '제목', description: '내용', status: BoardStatus.PRIVATE },
            );
        });
    });

    describe('deleteBoard', () => {
        const existedId: number = 1;
        const noExistedId: number = 2;
        let user: User = new User( 'joychae', '1234', []);
        it('should return that it deleted a board', async() => {
            const board: Board = new Board('제목', '내용', BoardStatus.PUBLIC, user);
            user.boards.push(board);

            await expect(controller.deleteBoard(user, existedId)).resolves.toEqual({
                deleted: true,
            });
        });
        it('should return that it did not deleted a board', async() => {
            const deleteSpy = jest.spyOn(service, 'deleteBoard').mockResolvedValueOnce({ deleted: false });
            await expect(controller.deleteBoard(user, noExistedId)).resolves.toEqual({
                deleted: false,
            });
        })
    })
});
