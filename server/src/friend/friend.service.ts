import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assurez-vous d'importer votre service Prisma
import { CreateFriendInput } from './dto/create-friend.input';
import { UpdateFriendInput } from './dto/update-friend.input';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFriendInput: CreateFriendInput) {
    // Utilisez le client Prisma pour créer un nouvel ami
    return this.prisma.friend.create({
      data: createFriendInput,
    });
  }

  async findAll() {
    // Utilisez le client Prisma pour récupérer tous les amis
    return this.prisma.friend.findMany();
  }

  async findFriendsByUserId(userId: number) {
    console.log("userId zebi : " + userId);
    const userWithFriends = await this.prisma.friend.findMany({
      where: {
        friendId: userId,
        pending: false,
        accepted: true,
      },
      include: {
        user: true
      }
    });
    // console.log(JSON.stringify(userWithFriends));
    
    const verifiedFriendsList: any[] = [];
console.log("userWithFriends : ", userWithFriends);
    for (let friendship of userWithFriends) {
        // Vérifiez si l'ami a également l'utilisateur comme ami
        console.log("friendship : ", friendship.userId);
        const reverseFriendship = await this.prisma.friend.findUnique({
            where: {
                userId_friendId: {
                    userId: friendship.friendId,
                    friendId: friendship.userId,
                }
            }
        });
        console.log("reverseFriendship : ", reverseFriendship);
        // Si le reverseFriendship existe et est accepté, ajoutez-le à la liste des amis vérifiés
        if (reverseFriendship && !reverseFriendship.pending && reverseFriendship.accepted) {
            verifiedFriendsList.push(friendship.user);
        }
    }

    console.log("verifiedFriendsList : ", verifiedFriendsList);
    return verifiedFriendsList;
}


  async findUserPending(userId: number) {
    console.log("userId : " + userId)
    const userWithFriends = await this.prisma.friend.findMany({
      where: {
        friendId: userId,
        pending: true,
      },
      include: {
        user: true
      }
  });
    // Ici, nous avons les amis sous userWithFriends.friends
    // Pour obtenir une liste propre des amis:
    console.log(JSON.stringify(userWithFriends));
    const friendsList = userWithFriends?.map((friendship) => friendship.user );
    // const friendsList = userWithFriends?.user.map(friendship => friendship.friend);
    console.log(friendsList);
    return friendsList;
  }

  async acceptFriendInvitation(userId: number, friendId: number) {
    console.log("userId 1: " + userId)
    console.log("friendId 1: " + friendId) 
    const friend = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId: friendId,
          friendId: userId,
        },
      },
    });
    await this.prisma.friend.update({
      where: {
        id: friend.id,
      },
      data: {
        accepted: true,
        pending: false,
      },
    });
    const existingFriendRelation = await this.prisma.friend.findUnique({
      where: {
          userId_friendId: {
              userId: userId,
              friendId: friendId,
          },
      },
  });
  if (existingFriendRelation) {
    return this.prisma.friend.update({
        where: {
            id: existingFriendRelation.id,
        },
        data: {
            accepted: true,
            pending: false,
        },
    });
  }
    return this.prisma.friend.create({
      data: {
        userId: userId,
        friendId: friendId,
        accepted: true,
        pending: false,
      },
    });
  }


  async refuseFriendInvitation(userId: number, friendId: number) {
    console.log("userId 1: " + userId)
    console.log("friendId 1: " + friendId) 
    const friend = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId: friendId,
          friendId: userId,
        },
      },
    });
    await this.prisma.friend.update({
      where: {
        id: friend.id,
      },
      data: {
        accepted: false,
        pending: false,
      },
    });
    const existingFriendRelation = await this.prisma.friend.findUnique({
      where: {
          userId_friendId: {
              userId: userId,
              friendId: friendId,
          },
      },
  });

  console.log("existingFriendRelation : ", existingFriendRelation);
  if (existingFriendRelation) {
    return this.prisma.friend.update({
        where: {
            id: existingFriendRelation.id,
        },
        data: {
            accepted: false,
            pending: false,
        },
    });
  }

  // Sinon, créez une nouvelle relation "friend".
  return this.prisma.friend.create({
      data: {
          userId: userId,
          friendId: friendId,
          accepted: false,
          pending: false,
      },
  });
  }


  async findOne(id: number) {
    // Utilisez le client Prisma pour récupérer un ami par son ID
    return this.prisma.friend.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateFriendInput: UpdateFriendInput) {
    // Utilisez le client Prisma pour mettre à jour un ami par son ID
    return this.prisma.friend.update({
      where: { id },
      data: updateFriendInput,
    });
  }

  async remove(id: number) {
    // Utilisez le client Prisma pour supprimer un ami par son ID
    return this.prisma.friend.delete({
      where: { id },
    });
  }
}
