import { Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Friend } from 'src/friend/entities/friend.entity';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuardToken } from 'src/auth/guards/auth.guard';

@Resolver(() => User)
@UseGuards(AuthGuardToken)
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

  @Query(() => User, { nullable: true }) // nullable: true si l'utilisateur peut ne pas être trouvé
  async getUsers(@Context() context) {
    console.log("context : " + context.req);
    return this.userService.getUser(context);
  }

  @Mutation(() => Friend)
  addFriend(@Args('id', { type: () => Int }) id: number, @Args('friendId') friendId: number) {
    return this.userService.addFriend(id, friendId);
  }

  @Mutation(() => Friend)
  suppFriend(@Args('id', { type: () => Int }) id: number, @Args('friendId') friendId: number) {
    return this.userService.suppFriend(id, friendId);
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

  @Mutation(() => String)
  async logout(@Context() context) {
    await this.userService.logout(context);
    return "Logout"; // Retourne vrai pour indiquer que l'action a été effectuée
  }
}
