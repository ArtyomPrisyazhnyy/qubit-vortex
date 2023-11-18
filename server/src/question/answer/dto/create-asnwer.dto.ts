import { ApiProperty } from "@nestjs/swagger";

export class CreateAnswerDto {
    @ApiProperty({example: 'You need to fix 5 line of code', description: 'Answer to question'})
    readonly answer: string;

    @ApiProperty({example: '3', description: 'User Id'})
    userId: number;

    @ApiProperty({example: '2', description: 'Question Id'})
    questionId: number;
}