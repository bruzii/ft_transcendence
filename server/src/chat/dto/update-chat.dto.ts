import { IsNotEmpty, IsString, IsArray} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateChatDto {
    @Field({ nullable: true})
    name?: string;

    @Field(() => [String], { nullable: true })
    userIds?: string[];

    @Field({ nullable: true })
    id?: number;
    
}
