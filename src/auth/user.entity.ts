import { Board } from "src/boards/boards.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type => Board, board => board.user, { eager: false })
    boards: Board[];

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}