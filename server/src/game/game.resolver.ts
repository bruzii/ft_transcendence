import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Mutation(() => Game)
  createGame(@Args('playerId1', { type: () => Int }) playerId1: number,
              @Args('playerId2', { type: () => Int }) playerId2: number) {
    return this.gameService.createGame(playerId1, playerId2);
  }

  @Query(() => [Game], { name: 'game' })
  findAll() {
    return this.gameService.findAll();
  }

  @Query(() => [Game], { name: 'gameAllForUserPlayer1' })
  getAllGameForUser(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.getAllGameForUserPlayer1(id);
  }

  @Query(() => [Game], { name: 'gameAllForUserPlayer2' })
  getAllGameForUserPlayer2(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.getAllGameForUserPlayer2(id);
  }

  @Query(() => Game, { name: 'game' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.findOne(id);
  }

  @Mutation(() => Game)
  finishGame(@Args('updateGameInput') updateGameInput: UpdateGameInput) {
    return this.gameService.finishGame(updateGameInput);
  }

  @Mutation(() => Game)
  launchGame(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.launchGame(id);
  }

  @Mutation(() => Game)
  removeGame(@Args('id', { type: () => Int }) id: number) {
    return this.gameService.remove(id);
  }
}
