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
    const userWithFriends = await this.prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            friends: {
                include: {
                    friend: true // Cela inclura les détails de l'ami.
                }
            }
        }
    });

    // Ici, nous avons les amis sous userWithFriends.friends
    // Pour obtenir une liste propre des amis:
    const friendsList = userWithFriends?.friends.map(friendship => friendship.friend);
    console.log(friendsList);
    return friendsList;
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
