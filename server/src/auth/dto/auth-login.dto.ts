import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class AuthLoginDto {

    @ApiProperty({example: 'user@gmail.com', description: 'email'})
    @IsString({message: 'Must be a string'})
    @IsEmail( {}, {message: 'Incorrect email'})
    readonly email: string;

    @ApiProperty({example: '1234567890', description: 'Password'})
    @IsString({message: 'Must be a string'})
    @Length(6, 20, {message: 'No less than 6 and no more than 20'})
    readonly password: string;
}