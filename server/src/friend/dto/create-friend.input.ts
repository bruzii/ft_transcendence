import { InputType, Int, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class CreateFriendInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  friendId: number;

  // @Field(() => User, { nullable: true } )
  // friend?: User;
}
