import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BoardsController } from './boards.controller';
import { Board } from './boards.entity';
import { BoardsService } from './boards.service';
import { BoardsResolver } from './boards.resolver';
import { BoardsRepository } from './boards.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BoardsRepository]), AuthModule],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsResolver],
})
export class BoardsModule {}
