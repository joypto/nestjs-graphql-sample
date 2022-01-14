import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: true,
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ req }),

    }),
    BoardsModule,
    AuthModule
  ]
})
export class AppModule {}
