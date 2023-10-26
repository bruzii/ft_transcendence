import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Friend {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
