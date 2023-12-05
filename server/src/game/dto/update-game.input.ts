import { CreateGameInput } from './create-game.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGameInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  scorePlayer1?: number;

  @Field({ nullable: true })
  scorePlayer2?: number;

  @Field({ nullable: true })
  winnerId?: number;

  @Field({ nullable: true })
  player1Id?: number;

  @Field({ nullable: true })
  player2Id?: number;

  @Field({ nullable: true })
  endedAt?: Date;
}
