import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Conversation } from './conversation.model';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/users.model';

@Table({ tableName: 'message' })
export class Message extends Model<Message> {
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ApiProperty({ example: 'Hello', description: 'Message content' })
    @Column
    message: string;

    @ApiProperty({ description: 'User who sent the message' })
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ApiProperty({ description: 'Conversation where the message was sent' })
    @ForeignKey(() => Conversation)
    @Column
    conversationId: number;

    @ApiProperty({ description: 'Date and time when the message was created' })
    @Column
    createdAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Conversation)
    conversation: Conversation;
}
