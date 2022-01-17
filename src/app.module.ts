import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from 'nestjs-prisma';
import * as config from 'config';

const graphqlConfig = config.get('graphql');

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot({
      playground: graphqlConfig.playground,
      debug: graphqlConfig.debug,
      sortSchema: graphqlConfig.sortSchema,
      installSubscriptionHandlers: true,
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
      context: ({ req }) => ({ req }),

    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BoardsModule,
  ]
})
export class AppModule {}
