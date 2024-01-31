import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/users/models/users.model";
import { Answer } from "../answer/models/answer.model";
import { Tags } from "src/tags/models/tags.model";
import { QuestionTags } from "src/tags/models/question-tags.model";

interface QuestionCreationAttrs {
    title: string,
    fullDescription: string;
    image: string;
}

@Table({tableName: 'question'})
export class Question extends Model<Question, QuestionCreationAttrs>{

    @ApiProperty({example: '1', description: 'Unique id'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'How to fix bug', description: 'Title of question'})
    @Column({type: DataType.TEXT, unique: false, allowNull: false})
    title: string;

    @ApiProperty({example: 'I have an error in line 5 of the code', description: 'Full description of the problem'})
    @Column({type: DataType.TEXT, unique: false, allowNull: false})
    fullDescription: string;
    
    @ApiProperty({example: '21', description: "number of question views"})
    @Column({type: DataType.INTEGER, unique: false, allowNull: false, defaultValue: 0})
    views: number;

    @ApiProperty({example: 'img', description: 'image'})
    @Column({type: DataType.STRING, allowNull: true})
    image: string;

    @ApiProperty({example: '', description: 'GPT Answer'})
    @Column({type: DataType.TEXT, unique: false, allowNull: true})
    gptAnswer: string

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @BelongsToMany(() => Tags, () => QuestionTags)
    tags: number[]

    @HasMany(() => Answer)
    answer: Answer[];

    @BelongsTo(() => User)
    user: User
}