import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field()
  intraId: number;

  @Field()
  lastName: string;

  @Field()
  firstName: string;

  @Field()
  email: string;


  // @Field()
  // imgUrl: string;

}
