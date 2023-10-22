import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field(() => Int)
  id: number;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  userName: string;

  @Field()
  avatar: string;

  // Add other fields as needed
}
