import { Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Friend } from 'src/friend/entities/friend.entity';
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  signUp(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'userAll' })
  findAll() {
    return this.userService.findAll();
  }

  @Mutation(() => Friend)
  addFriend(@Args('id', { type: () => Int }) id: number, @Args('email') email: string) {
    return this.userService.addFriend(id, email);
  }

  @Mutation(() => Friend)
  suppFriend(@Args('id', { type: () => Int }) id: number, @Args('email') email: string) {
    return this.userService.suppFriend(id, email);
  }

  @Query(() => User, { name: 'userOne' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  addWin(@Args('id', { type: () => Int }) id: number) {
    return this.userService.addWin(id);
  }

  @Mutation(() => User)
  addLose(@Args('id', { type: () => Int }) id: number) {
    return this.userService.addLose(id);
  }
  
  @Mutation(() => User)
  suppXP(@Args('id', { type: () => Int }) id: number, @Args('xp', { type: () => Int }) xp: number) {
    return this.userService.suppXP(id, xp);
  }
  
  @Mutation(() => User)
  addXP(@Args('id', { type: () => Int }) id: number, @Args('xp', { type: () => Int }) xp: number) {
    return this.userService.addXP(id, xp);
  }

  @Mutation(() => User)
  setOnline(@Args('id', { type: () => Int }) id: number) {
    return this.userService.setOnline(id);
  }
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
