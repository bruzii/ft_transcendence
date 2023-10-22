import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendService } from './friend.service';
import { Friend } from './entities/friend.entity';
import { CreateFriendInput } from './dto/create-friend.input';
import { UpdateFriendInput } from './dto/update-friend.input';

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
