import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFriendInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  friendId: number;

}
