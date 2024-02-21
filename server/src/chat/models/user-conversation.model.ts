import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/models/users.model";
import { Conversation } from "./conversation.model";

@Table({tableName: 'user_conversation', createdAt: false, updatedAt: false})
export class UserConversation extends Model<UserConversation> {

    @ForeignKey(() => Conversation)
    @Column({type: DataType.INTEGER})
    conversationId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
}