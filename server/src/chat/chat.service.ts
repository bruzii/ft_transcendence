import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/chat.entity';
import { UpdateUserInput } from 'src/user/dto/update-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async isUserAdminOfChatRoom(chatRoomId: number, userId: number): Promise<boolean> {
    console.log("chatRoomId : " + chatRoomId)
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      select: {
        admins: {
          where: { id: userId },
        },
      },
    });
  
    return chatRoom && chatRoom.admins.length > 0;
  }

  async saveMessage(content: string, userId: number, chatRoomId: number): Promise<Message> {
    console.log("content : " + content)
    return this.prisma.message.create({
      data: {
        content: content,
        userId: userId,
        chatRoomId: chatRoomId
      }
    });
  }

  async findOrCreatePrivateChatRoom(user1Id: number, user2Id: number): Promise<number> {
    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        AND: [
          { name: { startsWith: "private" } }, 
          { users: { some: { id: user1Id } } },
          { users: { some: { id: user2Id } } }
        ]
      }
    });
  
    if (chatRoom) {
      return chatRoom.id;
    } else {
      const newChatRoom = await this.prisma.chatRoom.create({
        data: {
          name: "private",
          users: {
            connect: [
              { id: user1Id },
              { id: user2Id }
            ]
          }
        }
      });
      
      // Step 2: Update the chat room name based on its generated ID
      const updatedChatRoom = await this.prisma.chatRoom.update({
        where: { id: newChatRoom.id },
        data: {
          name: `private_${newChatRoom.id}`
        }
      });
  
      return newChatRoom.id;
    }
  }
  

  async getAllMessagesFromChatRoom(chatRoomId: number, password?: string): Promise<Message[]> {
    console.log("password : " + password)
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });
  
    if (chatRoom && chatRoom.password) {
      if (!password) {
        throw new Error('Un mot de passe est requis pour accéder à ce chatRoom.');
      }
  
      const isPasswordValid = await bcrypt.compare(password, chatRoom.password);
  
      if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect.');
      }
    }
  
    return await this.prisma.message.findMany({
      where: { chatRoomId: chatRoomId },
      include: {
        user: true,
        chatRoom: {
          include: {
            bannedUsers: true,
            mutedUsers: true,
            users: true,
          }
        },
      },
    });
  }
  

  async updateChatRoom(id: number, adminId: number ,updateChatDto: UpdateChatDto) {
    return await this.prisma.chatRoom.update({
      where: {id: id},
      data: updateChatDto,
    });
  }

  async setPasswd(id: number, adminId: number ,passwd: string) {
    const isAdmin = await this.isUserAdminOfChatRoom(id, adminId);
    if (!isAdmin) {
      throw new Error("You are not admin of this chat room");
    }
  

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(passwd, saltRounds);
  
    return await this.prisma.chatRoom.update({
      where: {id: id},
      data: {password: hashedPassword},
    });
  }

  async createChatRoom(userId: number, friends: UpdateUserInput[]) {
    const usersToConnect = friends.map(friend => friend.id);
    const allUsersInRoom = [...usersToConnect, userId];

    // Sorting the user IDs for consistent comparison
    const sortedAllUsersInRoom = [...allUsersInRoom].sort((a, b) => a - b);

    const potentialChatRooms = await this.prisma.chatRoom.findMany({
        include: {
            users: true
        }
    });

    for (const chatRoom of potentialChatRooms) {
        // Extract user IDs from the chatRoom and sort them
        const sortedChatRoomUserIds = chatRoom.users.map(u => u.id).sort((a, b) => a - b);

        // Compare the sorted arrays
        if (JSON.stringify(sortedChatRoomUserIds) === JSON.stringify(sortedAllUsersInRoom)) {
            return chatRoom;
        }
    }

    // If no such chat room found, create a new one
    return await this.prisma.chatRoom.create({
        data: {
            users: {
                connect: allUsersInRoom.map(id => ({ id }))
            },
            admins: {
                connect: [{ id: userId }],
            },
        },
    });
}





  async addAdminToChatRoom(chatRoomId: number, userId: number, adminId: number) {
    console.log("chatRoomId 11: " + chatRoomId) 
    const existChatRoom = await this.prisma.chatRoom.findFirst({where: {id: chatRoomId}});
    if (!existChatRoom) {
      throw new Error("Chat room not found");
    }
    const existUser = await this.prisma.user.findFirst({where: {id: userId}});
    if (!existUser) {
      throw new Error("User not found");
    }
    const isAdmin = await this.isUserAdminOfChatRoom(chatRoomId, adminId);
    const isUserAdmin = await this.isUserAdminOfChatRoom(chatRoomId, userId);
    if (!isAdmin || isUserAdmin) {
      throw new Error("User is already admin of this chat room or user is not Admin");
    }

    return await this.prisma.chatRoom.update({
      where: {id: chatRoomId},
      data: {
        admins: {
          connect: [{ id: userId }],
        },
      },
    });
  }

  async addUserToChatRoom(chatRoomId: number, userId: number[]) {
    console.log("chatRoomId 11: " + chatRoomId)
    console.log("userId 11: " + JSON.stringify(userId))
    const existChatRoom = await this.prisma.chatRoom.findFirst({where: {id: chatRoomId}});
    if (!existChatRoom) {
      throw new Error("Chat room not found");
    }
    return await this.prisma.chatRoom.update({
      where: {id: chatRoomId},
      data: {
        users: {
          connect: userId.map((id) => ({id: id})),
        },
      },
      include: {
        users: true,
      },
    });
  }

  async getChatRoom(id: number) {
    return await this.prisma.chatRoom.findUnique({where: {id: id}});
  }

  async getChatRoomsForUser(userId: number) {
    console.log("userId : " + userId)
    return await this.prisma.chatRoom.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: userId,
              },
            },
          },
          {
            NOT: {
              bannedUsers: {
                some: {
                  id: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        users: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
  
  async  getBannedUsersFromChatRoom(chatRoomId: number, adminUserId: number): Promise<User[]> {
    // Récupérez la salle de chat avec les utilisateurs bannis
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        bannedUsers: true,
        admins: true,
      },
    });

    if (!chatRoom) {
      throw new Error('ChatRoom not found');
    }

    // Vérifiez si l'utilisateur qui fait la demande est un administrateur
    const isAdmin = chatRoom.admins.some(admin => admin.id === adminUserId);
    if (!isAdmin) {
      throw new Error('User is not an admin of the ChatRoom');
    }

    return chatRoom.bannedUsers;
}

  async banUserFromChatRoom(chatRoomId: number, userIdToBan: number, adminUserId: number): Promise<string> {
    // Étape 1: Récupérez la salle de chat pour vérifier les détails
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        users: true,
        admins: true,
        bannedUsers: true
      },
});

    if (!chatRoom) {
      throw new Error('ChatRoom not found');
    }
    console.log("chatRoom : " + chatRoom)
    // Étape 2: Vérifiez si l'utilisateur à bannir fait partie de la ChatRoom
    const isUserInChatRoom = chatRoom.users.some(user => user.id === userIdToBan);
    if (!isUserInChatRoom) {
      throw new Error('User is not part of the ChatRoom');
    }

    const isUserAlreadyBanned = chatRoom.bannedUsers.some(bannedUser => bannedUser.id === userIdToBan);
    if (isUserAlreadyBanned) {
    throw new Error('User is already banned from the ChatRoom');
    }

  
    // Étape 3: Vérifiez si l'utilisateur qui effectue le bannissement est un administrateur
    const isAdmin = chatRoom.admins.some(admin => admin.id === adminUserId);
    if (!isAdmin) {
      throw new Error('User is not an admin of the ChatRoom');
    }
  
    // Étape 4: Bannir l'utilisateur
    await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        bannedUsers: {
          connect: { id: userIdToBan }
        }
      }
    });
    return "User has been banned from ChatRoom"
  }
  
  async  muteUserInChatRoom(chatRoomId: number, userIdToMute: number, adminUserId: number): Promise<string> {
    // Étape 1: Récupérez la salle de chat pour vérifier les détails
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        users: true,
        admins: true,
      },
    });
  
    if (!chatRoom) {
      throw new Error('ChatRoom not found');
    }
  
    // Étape 2: Vérifiez si l'utilisateur à mettre en sourdine fait partie de la ChatRoom
    const isUserInChatRoom = chatRoom.users.some(user => user.id === userIdToMute);
    if (!isUserInChatRoom) {
      throw new Error('User is not part of the ChatRoom');
    }
  
    // Étape 3: Vérifiez si l'utilisateur qui effectue l'action est un administrateur
    const isAdmin = chatRoom.admins.some(admin => admin.id === adminUserId);
    if (!isAdmin) {
      throw new Error('User is not an admin of the ChatRoom');
    }
  
    // Étape 4: Mettre l'utilisateur en sourdine
    await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        mutedUsers: {
          connect: { id: userIdToMute }
        }
      }
    });
  
    return "User has been muted in ChatRoom";
}

  async unMutedUserInChatRoom(chatRoomId: number, userIdToUnMute: number, adminUserId: number): Promise<string> {
    // Étape 1: Récupérez la salle de chat pour vérifier les détails
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        users: true,
        admins: true,
      },
    });
    if (!chatRoom) {
      throw new Error('ChatRoom not found');
    }
    const isAdmin = chatRoom.admins.some(admin => admin.id === adminUserId);
    if (!isAdmin) {
      throw new Error('User is not an admin of the ChatRoom');
    }
    await this.prisma.chatRoom.update({

      where: { id: chatRoomId },
      data: {
        mutedUsers: {
          disconnect: { id: userIdToUnMute }
        }
      }
    });
    return "User has been unmuted in ChatRoom";
  }


  async sendMessage(userId: number, chatRoomId: number, message: string) {
    const existChatRoom = await this.prisma.chatRoom.findFirst({where: {id: chatRoomId}});
    if (!existChatRoom) {
      throw new Error("Chat room not found");
    }
    return await this.prisma.message.create({
      data: {
        content: message,
        chatRoomId: chatRoomId,
        userId
      },
      include: {
        chatRoom: {
          include: {
            users: true,
          },
        },
        user: true,
      }
    });
  }

  async sendMessageToUser(userId: number, chatRoomId: number, message: string, userToId: number) {
    const existChatRoom = await this.prisma.chatRoom.findFirst({where: {id: chatRoomId}});
    if (!existChatRoom) {
        await this.prisma.chatRoom.create({
          data: {
            name: "Dual Room",
            users: {
              connect: [{ id: userId }, { id: userToId }],
            },
            admins: {
              connect: [{ id: userId }], // Ceci ajoute le créateur comme administrateur
            },
          },
        });
    }
    return await this.prisma.message.create({
      data: {
        content: message,
        chatRoomId: chatRoomId,
        userId
      },
      include: {
        chatRoom: {
          include: {
            users: true,
          },
        },
        user: true,
      }
    });
  }

  async getMessagesFromChatRoom(chatRoomId: number) {
    const existChatRoom = await this.prisma.chatRoom.findFirst({where: {id: chatRoomId}});
    if (!existChatRoom) {
      throw new Error("Chat room not found");
    }
    return await this.prisma.message.findMany({
      where: {chatRoomId: chatRoomId},
      include: {
        chatRoom: {
          include: {
            users: {
              orderBy: {
                createdAt: 'desc',
                }
              }
            },
          },
        user: true,
        }
    });
  }

  async removeUserFromChatRoom(chatRoomId: number, userId: number, adminId: number) {
    console.log("adminId : " + adminId)
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        users: true,
        admins: true,
      },
    });
    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    const isAdmin = chatRoom.admins.some(admin => admin.id === adminId);
    if (!isAdmin) {
      throw new Error('User is not an admin of the ChatRoom');
    }
    const isUserAdmin = chatRoom.admins.some(admin => admin.id === userId);
    if (isUserAdmin) {
      throw new Error('User is admin of the ChatRoom');
    }
    return await this.prisma.chatRoom.update({
      where: {id: chatRoomId},
      data: {
        users: {
          disconnect: [{id: userId}],
        },
      },
    });
  }

  async deleteChatRoom(id: number, userId: number) {
    const isAdmin = await this.isUserAdminOfChatRoom(id, userId);
    if (!isAdmin) {
      throw new Error("You are not admin of this chat room");
    }
    const existChatRoom = await this.prisma.chatRoom.findFirst({where: {id: id}});
    if (!existChatRoom) {
      throw new Error("Chat room not found");
    }
    return await this.prisma.chatRoom.delete({where: {id: id}});
  }
}
