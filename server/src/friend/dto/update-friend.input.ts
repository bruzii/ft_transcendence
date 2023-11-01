import { CreateFriendInput } from './create-friend.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFriendInput extends PartialType(CreateFriendInput) {
  @Field(() => Int, {nullable: true})
  id?: number;
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  friendId: number;

  @Field(() => Boolean, { nullable: true } )
  accepted?: boolean;

  @Field(() => Boolean, { nullable: true })
  pending?: boolean;
}
