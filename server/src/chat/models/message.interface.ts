import { Conversation } from 'src/chat/models/conversation.model';
import { User } from 'src/users/models/users.model';

export interface IMessage {
    id?: number;
    message?: string;
    user?: User;
    conversation?: Conversation;
    createdAt?: Date
}