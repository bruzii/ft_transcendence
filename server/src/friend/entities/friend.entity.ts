import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
@ObjectType()
export class Friend {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  friendId: number;

  @Field(() => User, { nullable: true } )
  friend: User;

  @Field(() => Boolean, { nullable: true } )
  accepted: boolean;

  @Field(() => Boolean)
  pending: boolean;

}
