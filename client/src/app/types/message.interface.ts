import { IConversation } from "./conversation.interface";
import { IUSersPage } from "./user.interface";

export interface IMessage {
    id: number,
    message: string;
    user: IUSersPage;
    conversation: IConversation;
    createdAt: Date;
}