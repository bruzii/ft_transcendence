import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { FriendService } from 'src/friend/friend.service';
import { CreateFriendInput } from 'src/friend/dto/create-friend.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private friendService: FriendService) {}

  async addFriend(id: number, friendId: number) {
    console.log("id : " + id);
    console.log("friendId : " + friendId);
    
    const FriendIsOK = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId: friendId,
          friendId: id
        }
      }
    });
    console.log("FriendIsOK : " + FriendIsOK);
    const data: CreateFriendInput = {
        userId: id,
        friendId: friendId,
        pending: (FriendIsOK && FriendIsOK.accepted) ? false : true,
        accepted: true,
    };
    const exist = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId: id,
          friendId: friendId
        }
      }
    });
    console.log("exist : " + exist);
    if(exist) {
        return this.friendService.update(exist.id, data);
    } else {
        return this.friendService.create(data);
    }
}



  async suppFriend(id: number, friendId: number) {
    console.log("id : " + id)
    console.log("friendId : " + friendId)
    const friend = await this.prisma.friend.findUnique({where: {userId_friendId: {userId: id, friendId: friendId}}});
    console.log(friend);
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
