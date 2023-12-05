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
   return await this.prisma.game.update({
      where: { id: id },
      data: {
        waitingForPlayer: false,
        startedAt: new Date(),
      },
      include: {
        winner: true,
      },
    });
  }

  async finishGame(data : UpdateGameInput) {
    console.log("data", data)
    let winnerId: number = data.scorePlayer1 > data.scorePlayer2 ? data.player1Id : data.player2Id;
    console.log("winnerId", winnerId)
    return await this.prisma.game.update({
      where: { id: data.id },
      data: {
        winnerId: winnerId,
        endedAt : new Date(),
        scorePlayer1: data.scorePlayer1,
        scorePlayer2: data.scorePlayer2,
      },
      include: {
        winner: true,
      },
    });
  }

  async getAllGameForUserPlayer1(id: number) {
    return await this.prisma.game.findMany({
      where: {
        player1Id: id,
      },
      include: {
        player1: true,
        player2: true,
        winner: true,
      },
    });
  }

  async getAllGameForUserPlayer2(id: number) {
    return await this.prisma.game.findMany({
      where: {
        player2Id: id,
      },
      include: {
        player1: true,
        player2: true,
        winner: true,
      },
    });
  }

  findAll() {
    return `This action returns all game`;
  }

 async findOne(id: number) {
    return await this.prisma.game.findUnique({where: {id: id}});
  }

  update(id: number, updateGameInput: UpdateGameInput) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
