import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginDto {

    @ApiProperty({example: 'user@gmail.com', description: 'email'})
    readonly email: string;
    @ApiProperty({example: '1234567890', description: 'password'})
    readonly password: string;
}