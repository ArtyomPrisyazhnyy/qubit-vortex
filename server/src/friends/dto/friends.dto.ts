import { ApiProperty } from "@nestjs/swagger";
import { IsNumber} from "class-validator";

export class AddFriendDto {

    @ApiProperty({example: '3', description: 'User Id'})
    @IsNumber()
    readonly friendId: number;
}