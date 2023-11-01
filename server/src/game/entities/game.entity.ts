import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';


@ObjectType()
export class Game {
  @Field(() => Int, {nullable: true})
  id?: number;

  @Field(() => Int, {nullable: true})
  player1Id?: number;

  @Field(() => Int, {nullable: true})
  player2Id?: number;

  @Field(() => Int, {nullable: true})
  winnerId?: number;

  @Field(() => Int, {nullable: true})
  scorePlayer1?: number;

  @Field(() => Int, {nullable: true})
  scorePlayer2?: number;

  @Field({ nullable: true})
  startedAt: Date;

  @Field({ nullable: true})
  endedAt: Date;

  @Field(() => User, { nullable: true})
  player1?: User;

  @Field(() => User, { nullable: true})
  player2?: User;

  @Field(() => User, { nullable: true})
  winner?: User;

}
