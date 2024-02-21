import { Column, DataType, Model, Table, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Message } from './message.model';
import { ApiProperty } from '@nestjs/swagger';
import { ActiveConversation } from './active-conversation.model';
import { User } from 'src/users/models/users.model';
import { UserConversation } from './user-conversation.model';

@Table({ tableName: 'conversation' })
export class Conversation extends Model<Conversation> {
    
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ApiProperty({ type: () => [User], description: 'Users participating in the conversation' })
    @BelongsToMany(() => User, () => UserConversation)
    users: User[];

    @ApiProperty({ type: () => [Message], description: 'Messages in the conversation' })
    @HasMany(() => Message)
    messages: Message[];

    @ApiProperty({ type: () => Date, description: 'Date of the last update' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    lastUpdated: Date;
}
