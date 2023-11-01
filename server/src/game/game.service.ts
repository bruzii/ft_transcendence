import { Injectable } from '@nestjs/common';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async createGame(player2Id: number, player1Id: number) {
    return await this.prisma.game.create({
      data: {
        player2: {
          connect: { id: player2Id },
        },
        player1: {
          connect: { id: player1Id },
        },
      },
    });
  }

  async launchGame(id: number) {
    await this.prisma.game.update({
      where: { id: id },
      data: {
        waitingForPlayer: false,
      },
    });
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameInput: UpdateGameInput) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
