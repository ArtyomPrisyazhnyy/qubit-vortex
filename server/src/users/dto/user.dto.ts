import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsEmail} from 'class-validator';

export class UserDto {

    @ApiProperty({example: 'user@gmail.com', description: 'email'})
    @IsString({message: 'must be a string'})
    @IsEmail( {}, {message: 'incorrect email'})
    email: string;
    
    @ApiProperty({example: '12345678', description: 'password'})
    @IsString({message: 'must be a string'})
    @Length(4, 16, {message: 'no less than 4 and no more than 16'})
    readonly password: string;
}