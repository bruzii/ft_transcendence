import { IsNotEmpty, IsString, IsArray} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateChatDto {
    @Field({ nullable: false})
    name?: string;

    @Field(() => [String])
    userIds: string[];


}
