import { IUSersPage } from "./user.interface";

export interface IConversation {
    id?: number;
    users?: IUSersPage[]
    lastUpdated?: Date
}