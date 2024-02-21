import { Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IConversation } from '../../types/conversation.interface';
import { IMessage } from '../../types/message.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-chats-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './chats-page.component.html',
    styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent implements OnInit{
    //newMessage$: Observable<string>;
    messageData:  FormGroup;
    
    messages: IMessage[] = [];

    userId: number = 0;

    conversations: IConversation[] = []
    conversation: IConversation = {}


    constructor(
        private chatService: ChatService,
        private authService: AuthService
    ){
        this.messageData = new FormGroup({
            message: new FormControl<string>('')
        })
    }

    ngOnInit() {
        this.chatService.getNewMessage().subscribe((message: IMessage) => {
            this.messages.push(message);
          });
      
          this.chatService.getConversationMessages().subscribe((messages: IMessage[]) => {
            this.messages = messages;
          });
    }

    onSubmit(){
        const { message } = this.messageData.value;
        if (!message) return;
        this.chatService.sendMessage(message, this.conversation);
        this.messageData.reset();
    }

    createConversation(friend: any): void {
        this.chatService.createConversation(friend);
    }
    
    joinConversation(friendId: number): void {
        this.chatService.joinConversation(friendId);
    }

    leaveConversation(): void {
        this.chatService.leaveConversation();
    }
}
