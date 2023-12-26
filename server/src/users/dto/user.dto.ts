import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsEmail} from 'class-validator';

export class UserDto {

    @ApiProperty({example: 'user@gmail.com', description: 'email'})
    @IsString({message: 'Must be a string'})
    @IsEmail( {}, {message: 'Incorrect email'})
    readonly email: string;
    
    @ApiProperty({example: '12345678', description: 'Password'})
    @IsString({message: 'Must be a string'})
    @Length(6, 20, {message: 'No less than 6 and no more than 20'})
    readonly password: string;

    @ApiProperty({example: 'Alex', description: 'NickName'})
    @IsString({message: 'Must be a string'})
    @Length(4, 20, {message: 'No less than 4 and no more than 20'})
    readonly nickname: string
}