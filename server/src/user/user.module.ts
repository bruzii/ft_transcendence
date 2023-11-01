import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'
import { FriendService } from 'src/friend/friend.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFAService } from 'src/auth/2FA/twoFA-generator';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserResolver, 
    UserService, 
    PrismaService, 
    FriendService, 
    AuthService, 
    AuthTwoFAService, 
    JwtService,
    ConfigService
  ],
})
export class UserModule {}
