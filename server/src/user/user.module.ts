import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  providers: [UserResolver, UserService, PrismaService],
})
export class UserModule {}
