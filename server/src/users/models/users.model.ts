import { Column, Table, DataType, Model, HasOne, HasMany, BelongsToMany, BelongsTo } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { Question } from "src/question/models/question.model";
import { Answer } from "src/question/answer/models/answer.model";

interface UserCreationAttrs {
    email: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{

    @ApiProperty({example: 1, description: 'Unique id'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'user@gmail.com', description: 'email'})
    @Column({type: DataType.STRING, unique: true})
    email: string;

    @ApiProperty({example: '123455678', description: 'password'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;


    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @HasMany(() => Question)
    question: Question[]

    @HasMany(() => Answer)
    answer: Answer[]
}