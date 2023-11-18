import { ApiProperty } from "@nestjs/swagger";

export class CreateQuestionDto {
    @ApiProperty({example: 'How to fix bug', description: 'Title of question'})
    readonly title: string;

    @ApiProperty({example: 'I have an error in line 5 of the code', description: 'Full description of the problem'})
    readonly fullDescription: string;

    @ApiProperty({example: '3', description: 'User Id'})
    userId: number;
}