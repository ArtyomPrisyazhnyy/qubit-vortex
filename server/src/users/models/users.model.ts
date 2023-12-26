import { Column, Table, DataType, Model, HasMany, BelongsToMany } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { Question } from "src/question/models/question.model";
import { Answer } from "src/question/answer/models/answer.model";
import { Friends } from "src/friends/models/friends.model";

interface UserCreationAttrs {
    email: string;
    password: string;
    nickname: string;
    image: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{

    @ApiProperty({example: 1, description: 'Unique id'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'user@gmail.com', description: 'Email'})
    @Column({type: DataType.STRING, unique: true})
    email: string;

    @ApiProperty({example: '123455678', description: 'Password'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'Alex', description: 'Nickname'})
    @Column({type: DataType.STRING, allowNull: false})
    nickname: string;

    @ApiProperty({example: 'img', description: 'Avatar image'})
    @Column({type: DataType.STRING, allowNull: true})
    avatar: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @HasMany(() => Question)
    question: Question[]

    @HasMany(() => Answer)
    answer: Answer[]

    @HasMany(() => Friends)
    friends: Friends[]
}