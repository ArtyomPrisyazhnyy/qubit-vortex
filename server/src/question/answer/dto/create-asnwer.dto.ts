import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateAnswerDto {
    @ApiProperty({example: 'You need to fix 5 line of code', description: 'Answer to question'})
    @IsString()
    readonly answer: string;

    @ApiProperty({example: '3', description: 'User Id'})
    @IsNumber()
    readonly userId: number;
}