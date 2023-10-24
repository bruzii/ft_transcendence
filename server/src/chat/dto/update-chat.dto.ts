import { IsNotEmpty, IsString, IsArray} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateChatDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => [String])
    userIds: string[];

    
}
