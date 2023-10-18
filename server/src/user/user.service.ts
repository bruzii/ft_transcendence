import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    return await this.prisma.user.create({
      data: {userName: createUserInput.userName, lastName: createUserInput.lastName},
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return  this.prisma.user.findUnique({where: {id: id}});
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.prisma.user.update({
      where: {id: id},
      data: {userName: updateUserInput.userName, lastName: updateUserInput.lastName},
      });
  }

  remove(id: number) {
    return this.prisma.user.delete({where: {id: id}});
  }
}
