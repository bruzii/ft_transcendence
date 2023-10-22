import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Friend } from 'src/friend/entities/friend.entity';
@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  userName: string;

  @Field()
  avatar: string;

  @Field()
  connected: boolean;

  @Field()
  xp: number;

  @Field()
  email: string;

  @Field()
  win: number;

  @Field()
  lose: number;

  @Field()
  intraId: number;

  @Field()
  twoFactorAuthenticationSecret: string;

  @Field()
  TwoFA: boolean;

  @Field(() => [Friend], { nullable: true })
  friends: Friend[];

  @Field()
  createdAt: Date;

}
