import { User } from "src/users/models/users.model";

export interface IConversation {
    id?: number;
    users?: User[];
    lastUpdated: Date;
}