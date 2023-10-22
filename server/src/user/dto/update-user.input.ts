import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true }) // Champ userName rendu non obligatoire
  userName?: string;

  @Field({ nullable: true }) // Champ lastName rendu non obligatoire
  lastName?: string;

  @Field({ nullable: true }) // Champ firstName rendu non obligatoire
  firstName?: string;

  @Field({ nullable: true }) // Champ TwoFa rendu non obligatoire
  TwoFA?: boolean;

  @Field({ nullable: true }) // Champ connected rendu non obligatoire
  connected?: boolean;

  @Field({ nullable: true }) // Champ avatar rendu non obligatoire
  avatar?: string;
}