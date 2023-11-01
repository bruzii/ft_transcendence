import { Module, Query, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    UserModule,
    AuthModule,
    FriendModule,
    ChatModule,
    GameModule,
  ],
  providers: [PrismaService],
})

export class AppModule {

}