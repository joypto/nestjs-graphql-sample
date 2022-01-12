import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BoardsController } from './boards.controller';
import { Board } from './boards.entity';
import { BoardsRepository } from './boards.repository';
import { BoardsService } from './boards.service';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [
    TypeOrmModule.forFeature([Board]),
    AuthModule,
]
})
export class BoardsModule {}
