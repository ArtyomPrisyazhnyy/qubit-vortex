import { Column, Table, DataType, Model, HasMany, BelongsToMany } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { Question } from "src/question/models/question.model";
import { Answer } from "src/question/answer/models/answer.model";
import { Friends } from "src/friends/models/friends.model";
import { Conversation } from "src/chat/models/conversation.model";
import { Message } from "src/chat/models/message.model";
import { UserConversation } from "src/chat/models/user-conversation.model";

interface UserCreationAttrs {
    email: string;
    password: string;
    nickname: string;
    image: string;
    country: string | null;
    aboutMe: string | null;
    links: string | null;
    isPrivate: boolean;
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

    @ApiProperty({example: 'USA', description: 'User country'})
    @Column({type: DataType.STRING, allowNull: true})
    country: string;

    @ApiProperty({example: "I'm learning Python and Django", description: 'About the user'})
    @Column({type: DataType.TEXT, allowNull: true})
    aboutMe: string;

    @ApiProperty({example: "https://...", description: 'User links'})
    @Column({type: DataType.TEXT, allowNull: true})
    links: string;

    @ApiProperty({example: false, description: "Is private account"})
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    isPrivate: boolean;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

    @HasMany(() => Question)
    question: Question[]

    @HasMany(() => Answer)
    answer: Answer[]

    @HasMany(() => Friends, {as: 'UserFriends'})
    friends: Friends[]

    @HasMany(() => Friends, {as: 'recieviedFriendReq'})
    recieviedFriendReq: Friends[]

    @HasMany(() => Friends, {as: 'sentFriendReq'})
    sentFriendReq: Friends[]


    @BelongsToMany(() => Conversation, () => UserConversation)
    conversations: Conversation[];

    @HasMany(() => Message)
    messages: Message[];
}