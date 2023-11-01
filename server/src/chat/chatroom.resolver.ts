import { Context, Mutation, Resolver, Query, Int } from "@nestjs/graphql";
import { ChatService } from "./chat.service";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { UpdateUserInput } from 'src/user/dto/update-user.input';
import { ChatRoom, Message, UserTyping, UserStoppedTyping } from "./entities/chat.entity";
import { Args } from "@nestjs/graphql"
import { User } from "src/user/entities/user.entity";
import * as bcrypt from 'bcrypt';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

    @Mutation(() => ChatRoom)
    async createChatRoom(
        @Args('userId', { type: () => Int }) userId: number,
        @Args('friends', { type: () => [UpdateUserInput] }) friends: UpdateUserInput[],
        @Context() context: { req: Request }) {
            console.log(context.req.user);
      return this.chatService.createChatRoom(userId, friends); // METTRE context.req.user.id a la place de 3 mais ca marche pas
    }

    @Mutation(() => ChatRoom)
    async addUserToChatRoom(
        @Args('chatRoomId', { type: () => Int }) chatRoomId: number,
        @Args('userId', { type: () => [Int] }) userId: number[]) {
      return this.chatService.addUserToChatRoom(chatRoomId, userId);
    }

    @Mutation(() => String)
    async BanUserFromChatRoom(
        @Args('chatRoomId', { type: () => Int }) chatRoomId: number,
        @Args('userIdBan', { type: () => Int }) userId: number,
        @Args('userIdAdmin', { type: () => Int }) userIdAdmin: number) {
    return await this.chatService.banUserFromChatRoom(chatRoomId, userId, userIdAdmin);
    }

    @Mutation(() => String)
    async MuteUserFromChatRoom(
        @Args('chatRoomId', { type: () => Int }) chatRoomId: number,
        @Args('userIdMute', { type: () => Int }) userId: number,
        @Args('userIdAdmin', { type: () => Int }) userIdAdmin: number) {
    return await this.chatService.muteUserInChatRoom(chatRoomId, userId, userIdAdmin);
    }


    @Query(() => [ChatRoom])
    async getChatRoomsForUser(
        @Args('userId', { type: () => Int }) userId: number) {
      return this.chatService.getChatRoomsForUser(userId);
    }

    @Query(() => [User])
    async bannedUsersFromChatRoom(
        @Args('chatRoomId', { type: () => Int }) chatRoomId: number,
        @Args('adminUserId', { type: () => Int }) adminUserId: number
    ): Promise<User[]> {
        return this.chatService.getBannedUsersFromChatRoom(chatRoomId, adminUserId);
    }

    @Query(() => [Message])
    async getAllMessagesFromChatRoom(
        @Args('chatRoomId', { type: () => Int }) chatRoomId: number,
        @Args('password', { type: () => String, nullable: true }) password?: string
    ) {
      return this.chatService.getAllMessagesFromChatRoom(chatRoomId, password);
    }
    
    
    @Query(() => [Message])
    async getMessagesForChatRoom(
        @Args('chatRoomId', { type: () => Int }) chatRoomId: number) {
      return this.chatService.getChatRoomsForUser(chatRoomId);
    }

    @Mutation(() => String)
    async deleteChatRoom(
        @Args('chatRoomId', { type: () => Int }) chatRoomId: number,
        @Args('userId', { type: () => Int }) userId: number) {
      await this.chatService.deleteChatRoom(chatRoomId, userId);
      return "Chat room deleted";
    }

}