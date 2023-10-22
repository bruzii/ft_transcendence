import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendResolver } from './friend.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [FriendResolver, FriendService, PrismaService],
})
export class FriendModule {}
