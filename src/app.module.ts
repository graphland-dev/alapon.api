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
import { AuthorizationModule } from './authorization/authorization.module';
import { SocketIoModule } from './socket.io/socket.io.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LivekitModule } from './api/livekit/livekit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'files'),
    //   exclude: ['/api/*', '/graphql'],
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'web-client/dist'),
    //   exclude: ['/api/(.*)', '/graphql', '/docs'],
    // }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      dbName: 'backout-chat-' + process.env.NODE_ENV,
      retryDelay: 5000,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      playground: true,
      autoSchemaFile: true,
    }),
    IdentityModule,
    AuthorizationModule,
    ChatModule,
    SocketIoModule,
    LivekitModule,
  ],
  controllers: [AppController],
  providers: [AppResolver],
})
export class AppModule {}
