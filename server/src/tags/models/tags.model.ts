import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Question } from "src/question/models/question.model";
import { QuestionTags } from "./question-tags.model";

interface TagsCreattionAttrs {
    tag: string;
    description: string;
}

@Table({tableName: 'tags'})
export class Tags extends Model<Tags, TagsCreattionAttrs>{

    @ApiProperty({example: '1', description: 'Unique id'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Java', description: 'Tag value'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    tag: string;

    @ApiProperty({example: 'Java is a high-level object-oriented programming language', description: 'Tag description'})
    @Column({type: DataType.TEXT, allowNull: false})
    description: string;

    @BelongsToMany(() => Question, () => QuestionTags)
    questions: Question[]
}