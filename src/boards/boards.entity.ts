import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BoardStatus } from "./boards.status";

@Entity()
export class Board extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;
    
    @Column()
    status: BoardStatus;

    @ManyToOne(type => User, user => user.boards, { eager: true })
    user: User;

    constructor(title: string, description: string, status: BoardStatus, user: User) {
        super();
        this.title = title;
        this.description = description;
        this.status = status;
        this.user = user;
    }
}
