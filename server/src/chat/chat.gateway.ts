import { WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WsResponse, MessageBody } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';

@WebSocketGateway(
  {
    cors: {
      origin: '*',
    },
  },
)

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService,
              private userService: UserService ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Socket ${client.id} connected.`);  
        
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket ${client.id} disconnected.`);
        this.server.emit('client::disconnect', client.id);
    }


    @SubscribeMessage('join')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        client.join(room);
        console.log(`Client ${client.id} joined room ${room}`);
    }

    //#region message
    @SubscribeMessage('message::group:add')
    async newMessageGroup(sender: Socket, message: any) {
        console.log(message)
        const messDate = new Date(message.timestamp);
        console.log(`Client ${message.userId} send a message to channel ${message.chan} at ${messDate.toDateString()}`);
        
        this.chatService.saveMessage(message.message, message.userId, message.roomId);
      
        this.server.to(`channel_${message.roomId}`).emit('message::receive::group::add', message.message);
    }

    @SubscribeMessage('message::user:add')
    async newMessageUser(sender: Socket, message: any) {
      console.log(message);
      console.log("message : " + message.content)
      const messDate = new Date(message.timestamp);
      console.log(`Client ${message.userId} send a message to channel ${message.roomId} at ${messDate.toDateString()}`);
    
      // Ensure the chat room exists between the sender and the recipient
      // const roomId = await this.chatService.findOrCreatePrivateChatRoom(message.userId, message.userToId); // Assuming you pass the recipientId in your message object.
    
      // console.log("roomId : " + roomId)
      // Save the message

      this.chatService.saveMessage(message.content, message.userId, message.roomId);
      const user = await this.userService.findOne(message.userId);
      message.user = user;
      // Emit the message to the chat room
      console.log(`channel_${message.roomId}`)
      this.server.to(`channel_${message.roomId}`).emit('message::receive::user::add', message);
    }
    
    //#endregion

    //#region admin events

    @SubscribeMessage('admin::join')
    async adminJoin(sender: Socket, data: any) {
        console.log(`Admin ${sender.id} joined room ${data.roomId}`);
        console.log(data);
        await this.chatService.addAdminToChatRoom(data.chatRoomId, data.userId, data.adminId);
        const user = await this.userService.findOne(data.userId);
        const admin = await this.userService.findOne(data.adminId);
        this.server.to(`channel_${data.chatRoomId}`).emit('admin::join::add', `${user.firstName} ${user.lastName} become admin by ${admin.firstName} ${admin.lastName}`);
    }

    @SubscribeMessage('admin::mute')
    async adminMute(sender: Socket, data: any) {
      console.log("data : " + data)
      await this.chatService.muteUserInChatRoom(data.chatRoomId, data.userId, data.adminId);
      const user = await this.userService.findOne(data.userId);
      const admin = await this.userService.findOne(data.adminId);
      this.server.to(`channel_${data.chatRoomId}`).emit('admin::mute::add', `${user.firstName} ${user.lastName} has been muted by ${admin.firstName} ${admin.lastName}`);
    }

    @SubscribeMessage('admin::ban')
    async adminBan(sender: Socket, data: any) {
      await this.chatService.banUserFromChatRoom(data.chatRoomId, data.userId, data.adminId);
      const user = await this.userService.findOne(data.userId);
      const admin = await this.userService.findOne(data.adminId);
      this.server.to(`channel_${data.chatRoomId}`).emit('admin::ban::add', `${user.firstName} ${user.lastName} has been banned by ${admin.firstName} ${admin.lastName}`);
    }

    //#endregion

    //#region user events

    @SubscribeMessage('user::addUser')
    async AddUserToChatRoom(sender: Socket, data: any) {
      console.log("data : " + data.userId)
      console.log(typeof(data.userId))
      await this.chatService.addUserToChatRoom(data.chatRoomId, data.userId);
      // const user = await this.userService.findOne(data.userId);
      // const admin = await this.userService.findOne(data.adminId);
      this.server.to(`channel_${data.chatRoomId}`).emit('user::addUser::add', ` User has been added by `);
    }

    @SubscribeMessage('message::delete')
    @SubscribeMessage('typing')
    typing(@MessageBody() data: {chatRoomId: number, userId: number}, @ConnectedSocket() client: Socket) {
      client.to(`chat_${data.chatRoomId}`).emit('userTyping', {userId: data.userId});
    }

}
