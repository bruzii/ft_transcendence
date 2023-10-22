import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './startegies/42.strategies';
import { UserService } from 'src/user/user.service';
import { forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthTwoFAService } from './2FA/twoFA-generator';
import { JwtService } from '@nestjs/jwt';
import { FriendService } from 'src/friend/friend.service';

import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, UserService, PrismaService,JwtService, AuthTwoFAService,ConfigService,FriendService],
})
export class AuthModule {}
