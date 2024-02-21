import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { IMessage } from '../types/message.interface';
import { IConversation } from '../types/conversation.interface';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(
        private socket: Socket
    ) { }

    sendMessage(message: string, conversation: IConversation): void {
        const newMessage = {
            message,
            conversation
        }
        this.socket.emit('sendMessage', newMessage);
    }

    getNewMessage(): Observable<IMessage>{
        return this.socket.fromEvent<IMessage>('newMessage');
    }

    createConversation(friend: any): void {
        this.socket.emit('createConversation', friend);
    }

    joinConversation(friendId: number): void {
        this.socket.emit('joinConversation', friendId);
    }

    leaveConversation(): void {
        this.socket.emit('leaveConversation');
    }

    getConversationMessages(): Observable<IMessage[]>{
        return this.socket.fromEvent<IMessage[]>('messages');
    }
}
