import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { FriendService } from 'src/friend/friend.service';
import { ChatResolver } from './chatroom.resolver';
import { GameService } from 'src/game/game.service';
@Module({
  providers: [
    ChatGateway, 
    ChatService, 
    PrismaService,
    UserService, 
    FriendService, 
    ChatResolver,
    GameService
  ],
})

export class ChatModule {}
