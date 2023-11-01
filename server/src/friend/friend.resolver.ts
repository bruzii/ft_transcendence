import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendService } from './friend.service';
import { Friend } from './entities/friend.entity';
import { CreateFriendInput } from './dto/create-friend.input';
import { UpdateFriendInput } from './dto/update-friend.input';
import { User } from 'src/user/entities/user.entity';
@Resolver(() => Friend)
export class FriendResolver {
  constructor(private readonly friendService: FriendService) {}

  // @Mutation(() => Friend)
  // createFriend(@Args('createFriendInput') createFriendInput: CreateFriendInput) {
  //   return this.friendService.create();
  // }

  @Query(() => [Friend], { name: 'friend' })
  findAll() {
    return this.friendService.findAll();
  }

  @Query(() => [User], { name: 'friendByUserId' })
  findFriendsByUserId(@Args('userId', { type: () => Int }) userId: number) {
    return this.friendService.findFriendsByUserId(userId);
  }

  @Query(() => [User], { name: 'getFriendPrending' })
  findFriendPending(@Args('userId', { type: () => Int }) friendId: number) {
    return this.friendService.findUserPending(friendId);
  }
  @Query(() => Friend, { name: 'friend' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.friendService.findOne(id);
  }

  @Mutation(() => Friend)
  updateFriend(@Args('updateFriendInput') updateFriendInput: UpdateFriendInput) {
    return this.friendService.update(updateFriendInput.id, updateFriendInput);
  }

  @Mutation(() => Friend)
  removeFriend(@Args('id', { type: () => Int }) id: number) {
    return this.friendService.remove(id);
  }
}
