import { WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WsResponse, MessageBody } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GameService } from 'src/game/game.service';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { FriendService } from 'src/friend/friend.service';
@WebSocketGateway(
  {
    cors: {
      origin: '*',
    },
  },
)

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
              private readonly chatService: ChatService,
              private userService: UserService,
              private friendService: FriendService,
              private gameService: GameService
              ) {}

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
    @SubscribeMessage('admin::UnMute')
    async adminuUnMute(sender: Socket, data: any) {
      console.log("data : " + data)
      await this.chatService.unMutedUserInChatRoom(data.chatRoomId, data.userId, data.adminId);
      const user = await this.userService.findOne(data.userId);
      const admin = await this.userService.findOne(data.adminId);
      this.server.to(`channel_${data.chatRoomId}`).emit('admin::UnMute::add', `${user.firstName} ${user.lastName} has been UnMuted by ${admin.firstName} ${admin.lastName}`);
    }
    
    @SubscribeMessage('admin::ban')
    async adminBan(sender: Socket, data: any) {
      await this.chatService.banUserFromChatRoom(data.chatRoomId, data.userId, data.adminId);
      const user = await this.userService.findOne(data.userId);
      const admin = await this.userService.findOne(data.adminId);
      this.server.to(`channel_${data.chatRoomId}`).emit('admin::ban::add', `${user.firstName} ${user.lastName} has been banned from ${admin.firstName} ${admin.lastName}`);
    }
    @SubscribeMessage('admin::remove::user')
    async adminRemoveUser(sender: Socket, data: any) {
      await this.chatService.removeUserFromChatRoom(data.chatRoomId, data.userId, data.adminId);
      const user = await this.userService.findOne(data.userId);
      const admin = await this.userService.findOne(data.adminId);
      this.server.to(`channel_${data.chatRoomId}`).emit('admin::remove::user::add', `${user.firstName} ${user.lastName} has been kick by ${admin.firstName} ${admin.lastName}`);
    }

    @SubscribeMessage('admin::update::chat')
    async adminUpdateChat(sender: Socket, data: any) {
      await this.chatService.updateChatRoom(data.chatRoomId, data.adminId,  data.updateChatDto);
      const admin = await this.userService.findOne(data.adminId);
      console.log("data : " + data)
      this.server.to(`channel_${data.chatRoomId}`).emit('admin::update::chat::add', `${admin.firstName} has change some parameter in the Room`);
    }
    
    @SubscribeMessage('admin::setPrivate::chat')
    async adminSetPrivateChat(sender: Socket, data: any) {
      console.log("data : " + data)
      await this.chatService.setPasswd(data.chatRoomId, data.adminId,  data.password);
      const admin = await this.userService.findOne(data.adminId);
      console.log("data : " + data)
      this.server.to(`channel_${data.chatRoomId}`).emit('admin::setPrivate::chat::add', `${admin.firstName} has set The group in Private mode`);
    }
    //#endregion

    //#region user events
    @SubscribeMessage('user::addUser')
    async AddUserToChatRoom(sender: Socket, data: any) {
      console.log("data : " + data.userId)
      console.log(typeof(data.userId))
      const ids: number[] = data.userId.map((value: any) => value.id);
      console.log("ids : " + ids)
      await this.chatService.addUserToChatRoom(data.chatRoomId, ids);
      // const user = await this.userService.findOne(data.userId);
      // const admin = await this.userService.findOne(data.adminId);
      this.server.to(`channel_${data.chatRoomId}`).emit('user::addUser::add', ` User has been added by `);
    }

    @SubscribeMessage('user::removeFriend')
    async removeFriend(sender: Socket, data: any) {
      console.log("data r: " + data.userId)
      console.log("data r: " + data.friendId)
      await this.userService.suppFriend(data.userId, data.friendId);
      console.log("data r: " + data.friendId)
      const user = await this.userService.findOne(data.userId);
      const admin = await this.userService.findOne(data.friendId);
      this.server.to(`friend_${data.friendId}`).emit('user::removeFriend::add', ` ${user.firstName} removed ${admin.firstName} from friend list`);
    }

    @SubscribeMessage('user::addFriend')
    async AddFriend(sender: Socket, data: any) {
      console.log("data : " + JSON.stringify(data))
      console.log(typeof(data.userId))
      const newFriend = await this.userService.addFriend(data.userId, data.friendId);
      console.log("newFriend : " + newFriend.id)
      const user = await this.userService.findOne(data.userId);
      const friend = await this.userService.findOne(data.friendId);
      console.log("newFriend : " + newFriend.id)
      console.log("user.id : " + user.id)
      console.log("friend.id : " + friend.id)
      this.server.to(`friend_${data.friendId}`).emit('user::addFriend::add', ` ${user.firstName} accepted ${friend.firstName} friend request`);
    }

    @SubscribeMessage('user::acceptFriend')
    async AcceptFriend(sender: Socket, data: any) {
      console.log("data : " + JSON.stringify(data))
      console.log(typeof(data.userId))
      const newFriend = await this.friendService.acceptFriendInvitation(data.userId, data.friendId);
      const user = await this.userService.findOne(data.userId);
      const friend = await this.userService.findOne(data.friendId);
      console.log("newFriend : " + newFriend.id)
      console.log("user.id : " + user.id)
      console.log("friend.id : " + friend.id)
      this.server.to(`friend_${data.friendId}`).emit('user::acceptFriend::add', ` ${user.firstName} accepted ${friend.firstName} friend request`);
    }

    @SubscribeMessage('user::refuseFriend')
    async RefuseFriend(sender: Socket, data: any) {
      console.log("data : " + JSON.stringify(data))
      console.log(typeof(data.userId))
      const newFriend = await this.friendService.refuseFriendInvitation(data.userId, data.friendId);
      const user = await this.userService.findOne(data.userId);
      const friend = await this.userService.findOne(data.friendId);
      console.log("newFriend : " + newFriend.id)
      console.log("user.id : " + user.id)
      console.log("friend.id : " + friend.id)
      this.server.to(`friend_${data.friendId}`).emit('user::refuseFriend::add', ` ${user.firstName} refused ${friend.firstName} friend request`);
    }

    //#region  Game 
    @SubscribeMessage('game::create')
    async createGame(sender: Socket, data: any) {
      console.log("data : " + JSON.stringify(data))
      const game = await this.gameService.createGame(data.player2Id, data.player1Id);
      console.log("game : " + game.id)
      console.log(`friend_${data.player2Id}`)
      this.server.to(`friend_${data.player2Id}`).emit('game::create::add', ` ${data.player1Id} created a game with ${data.player2Id}`);
    }

    @SubscribeMessage('game::launch')
    async launchGame(sender: Socket, data: any) {
      console.log("data : " + JSON.stringify(data))
      await this.gameService.launchGame(data.gameId);
      this.server.to(`game_${data.gameId}`).emit('game::launch::add', ` ${data.gameId} has been launched`);
    }
    //#endregion
    @SubscribeMessage('message::delete')
    @SubscribeMessage('typing')
    typing(@MessageBody() data: {chatRoomId: number, userId: number}, @ConnectedSocket() client: Socket) {
      client.to(`chat_${data.chatRoomId}`).emit('userTyping', {userId: data.userId});
    }

}
