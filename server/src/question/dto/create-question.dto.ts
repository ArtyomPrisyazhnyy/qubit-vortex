import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, ArrayUnique, IsString, isArray } from "class-validator";

export class CreateQuestionDto {
    @ApiProperty({example: 'How to fix bug', description: 'Title of question'})
    @IsString()
    readonly title: string;

    @ApiProperty({example: 'I have an error in line 5 of the code', description: 'Full description of the problem'})
    @IsString()
    readonly fullDescription: string;

    @ApiProperty({example: [1, 2, 3], description: 'tag Ids'})
    @ArrayNotEmpty()
    @ArrayUnique()
    tagIds: number[]; 
}