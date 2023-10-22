import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private friendService: FriendService) {}

  async addFriend(id: number, email: string) {
    const email42 = email + "@student.42.fr";
    const user = await this.prisma.user.findUnique({where: {email: email42}});
    if (!user) {
      throw new Error("User not found");
    }
    console.log("friends id  : " + user.id)
    console.log("id : " + id)
    const data = {
      userId: id,
      friendId: user.id,
    }
    return this.friendService.create(data);
  }

  async suppFriend(id: number, email: string) {
    const email42 = email + "@student.42.fr";
    const user = await this.prisma.user.findUnique({where: {email: email42}});
    if (!user) {
      throw new Error("User friend found");
    }
    const friend = await this.prisma.friend.findUnique({where: {userId_friendId: {userId: id, friendId: user.id}}});
    return this.friendService.remove(friend.id);
  }

  async create(createUserInput: CreateUserInput) {
    return await this.prisma.user.create({
      data: createUserInput,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        friends: {
          include: {
            friend: true, // Pour inclure les amis des amis
          },
        },
      },
    });
    
  }

  addWin(id: number) {
    return this.prisma.user.update({
      where: {id: id},
      data: {win: {increment: 1}},
      });
  }

  addLose(id: number) {
    return this.prisma.user.update({
      where: {id: id},
      data: {lose: {increment: 1}},
      });
  }

  suppXP(id: number, xp: number) {
    return this.prisma.user.update({
      where: {id: id},
      data: {xp: {decrement: xp}},
      });
  }

  addXP(id: number, xp: number) {
    return this.prisma.user.update({
      where: {id: id},
      data: {xp: {increment: xp}},
      });
  }

  addSecretTwoFA(id: number, secretTwoFA: string) {
    return this.prisma.user.update({
      where: {id: id},
      data: {twoFactorAuthenticationSecret: secretTwoFA},
      });
  }
  findOne(id: number) {
    return  this.prisma.user.findUnique({where: {id: id}});
  }
  setOnline(id: number) {
    console.log("id : " + id)
    return this.prisma.user.update({
      where: {id: id},
      data: {connected: true},
      });
  }
  update(id: number, updateUserInput: UpdateUserInput) {
    console.log(updateUserInput);
    return this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserInput }, // Utilisation de l'opérateur de déstructuration
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({where: {id: id}});
  }
}
