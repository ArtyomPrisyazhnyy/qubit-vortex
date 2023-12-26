import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsEmail} from 'class-validator';

export class UpdateUserInfoDto {

    @ApiProperty({example: 'Alex', description: 'NickName'})
    @IsString({message: 'Must be a string'})
    @Length(4, 20, {message: 'No less than 4 and no more than 20'})
    readonly nickname: string
}