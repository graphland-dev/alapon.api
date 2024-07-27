import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { IdentityModule } from './api/identity/identity.module';
import { ChatModule } from './api/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'files'),
    //   exclude: ['/api/*', '/graphql'],
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
      exclude: ['/api/*', '/graphql'],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      dbName: 'offline-chat-' + process.env.NODE_ENV,
      retryDelay: 5000,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      playground: true,
      autoSchemaFile: true,
    }),
    IdentityModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppResolver],
})
export class AppModule {}
