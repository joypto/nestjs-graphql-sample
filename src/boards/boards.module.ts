import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BoardsService } from './boards.service';
import { BoardsResolver } from './boards.resolver';

@Module({
  imports: [AuthModule],
  providers: [BoardsService, BoardsResolver],
})
export class BoardsModule {}
