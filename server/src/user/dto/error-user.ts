import { Field } from "@nestjs/graphql";

export class UserNotFoundError {
    constructor(message: string) {
      this.message = message;
    }
  
    @Field()
    message: string;
  }