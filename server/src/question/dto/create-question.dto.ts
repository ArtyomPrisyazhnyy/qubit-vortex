import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateQuestionDto {
    @ApiProperty({example: 'How to fix bug', description: 'Title of question'})
    @IsString()
    readonly title: string;

    @ApiProperty({example: 'I have an error in line 5 of the code', description: 'Full description of the problem'})
    @IsString()
    readonly fullDescription: string;

    @ApiProperty({example: '3', description: 'User Id'})
    @IsNumber()
    readonly userId: number;
}