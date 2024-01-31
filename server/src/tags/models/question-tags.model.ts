import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Question } from "src/question/models/question.model";
import { Tags } from "./tags.model";

@Table({tableName: 'question_tags', createdAt: false, updatedAt: false})
export class QuestionTags extends Model<QuestionTags>{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Question)
    @Column({type: DataType.INTEGER})
    questionId: number;

    @ForeignKey(() => Tags)
    @Column({type: DataType.INTEGER})
    tagsId: number;
}