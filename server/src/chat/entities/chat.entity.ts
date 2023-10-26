import { User } from "src/user/entities/user.entity";
import { ObjectType, Field, Int, ID} from '@nestjs/graphql';

@ObjectType() 
export class ChatRoom {
    @Field(() => Int, { nullable: true })
    id?: number;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    createdAt?: Date;

    @Field(() => String, { nullable: true })
    password?: string;
    
    @Field(() => [User], { nullable: true })
    admins?: User[];

    @Field(() => [User], { nullable: true })
    bannedUsers: User[];

    @Field(() => [User], { nullable: true })
    mutedUsers: User[];

    @Field(() => [User], { nullable: true })
    users?: User[];

    @Field(() => [Message], { nullable: true })
    messages?: Message[];
}

@ObjectType()
export class Message {
    @Field(() => Int)
    id: number;

    @Field({ nullable: true})
    content: string;

    @Field(() => User, { nullable: true})
    user?: User;

    @Field(() => ChatRoom, { nullable: true })
    chatRoom?: ChatRoom;

    @Field({})
    createdAt: Date;
}

@ObjectType()
export class UserTyping {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field({ nullable: true })
    chatroomId?: number;
}

@ObjectType()
export class UserStoppedTyping extends UserTyping {}