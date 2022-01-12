import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Board } from "./boards.entity";
import { createMock } from '@golevelup/ts-jest';
import { BoardStatus } from "./boards.status";
import { User } from "src/auth/user.entity";
import { BoardsRepository } from "./boards.repository";

describe('BoardsService using createMock with DI', () => {
    let repository : BoardsRepository;

    beforeEach(async() => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(Board),
                    useValue: createMock<BoardsRepository>(),
                },
            ],
        }).compile();

        repository = module.get<BoardsRepository>(getRepositoryToken(Board));
    })

    it('should repository mocked', () => {
        expect(typeof repository.find).toBe('function');
    });

    describe('BoardsService using createMock without DI', () => {
        const repository = createMock<BoardsRepository>();

        beforeEach(async() => {
            await Test.createTestingModule({
                providers: [
                    {
                        provide: getRepositoryToken(Board),
                        useValue: repository,
                    },
                ],
            }).compile();
        });

        it('should repository mocked', async() => {
            const user = new User('username', '1234', []);
            const board = new Board('title', 'description', BoardStatus.PUBLIC, user);
            repository.find.mockResolvedValue([board]);
            expect(await repository.find()).toEqual([board]);
        });
    });
});