import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GamesModule } from './games/games.module';
import { BoxesModule } from './boxes/boxes.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      debug: true,
      playground: true,
      cache: 'bounded',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cfoi1hirrk0fd9p59ch0-a',
      port: 5432,
      username: 'crossworddb_user',
      password: 'ZFYIdmDBCBmTk2l4lYBVr6AAEmVlFPxt',
      database: 'crossworddb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    GamesModule,
    BoxesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
