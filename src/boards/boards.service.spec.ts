import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";
import { Board } from "./boards.entity";
import { BoardsRepository } from "./boards.repository";
import { BoardsService } from "./boards.service"
import { BoardStatus } from "./boards.status";

const title = 'title sample';
const description = 'descripton sample'
let user: User;

const board = new Board(title, description, BoardStatus.PUBLIC, user);
const boards = [
    board,
    new Board('title2', 'description2', BoardStatus.PUBLIC, user),
    new Board('title3', 'description3', BoardStatus.PRIVATE, user),
];

describe('BoardsService', () => {
    let service: BoardsService;
    let repository: BoardsRepository;
  
    beforeEach(async () => {
      user = new User('username', '1234', []);
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            BoardsService,
            {
                provide: getRepositoryToken(Board),
                useValue: {
                find: jest.fn().mockResolvedValue(boards),
                findOne: jest.fn().mockResolvedValue(board),
                save: jest.fn(),
                update: jest.fn().mockResolvedValue(true),
                delete: jest.fn().mockResolvedValue(true),
                },
            },
        ],
      }).compile();
  
      service = module.get<BoardsService>(BoardsService);
      repository = module.get<BoardsRepository>(getRepositoryToken(Board));
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('getAllBoards', () => {
        it('should return all boards', async() => {
            const result = await service.getAllBoards();
            expect(result).toEqual(boards);
        });
    });
    
    describe('getBoardById', () => {
        it('should return a board by id', async() => {
            user.id = 1;
            const repositorySpy = jest.spyOn(repository, 'findOne');
            const result = await service.getBoardById(user.id);
            
            expect(result).toEqual(board);
            expect(repositorySpy).toBeCalledWith(user.id);
        })
    })
});

