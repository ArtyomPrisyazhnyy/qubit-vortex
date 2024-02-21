import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Conversation } from './conversation.model';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/users.model';

@Table({ tableName: 'active_conversation' })
export class ActiveConversation extends Model<ActiveConversation> {
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ApiProperty({ example: 'socketId', description: 'Socket ID' })
    @Column
    socketId: string;

    @ApiProperty({ example: 1, description: 'User ID' })
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ApiProperty({ example: 1, description: 'Conversation ID' })
    @ForeignKey(() => Conversation)
    @Column
    conversationId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Conversation)
    conversation: Conversation;
}
