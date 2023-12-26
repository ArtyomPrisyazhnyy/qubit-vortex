import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Question } from "src/question/models/question.model";
import { User } from "src/users/models/users.model";

interface AnswerCreationAttrs {
    answer: string;
    image: string;
}

@Table({tableName: 'answer'})
export class Answer extends Model<Answer, AnswerCreationAttrs>{

    @ApiProperty({example: '1', description: 'Unique id'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'You need to fix 5 line of code', description: 'Answer to question'})
    @Column({type: DataType.TEXT, unique: false, allowNull: false})
    answer: string;

    @ApiProperty({example: '', description: 'Image'})
    @Column({type: DataType.STRING, allowNull: true})
    image: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @ForeignKey(() => Question)
    @Column({type: DataType.INTEGER, allowNull: false})
    questionId: number;

    @BelongsTo(() => Question)
    question: Question;

    @BelongsTo(() => User)
    user: User
}