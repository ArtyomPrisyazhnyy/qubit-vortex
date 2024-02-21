import { ChatService } from './../../chat.service';
import { AuthService } from './../../../auth/auth.service';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IMessage } from 'src/chat/models/message.interface';
import { ActiveConversation } from 'src/chat/models/active-conversation.model';

@WebSocketGateway({cors: {origin: ['http://localhost:4200'] } })
export class ChatGateway implements
    OnGatewayConnection, 
    OnGatewayDisconnect,
    OnModuleInit
{

    constructor(
        private authService: AuthService, 
        private chatService: ChatService
    ){}

    onModuleInit() {
        this.chatService.removeActiveConversations();
    }
    
    @WebSocketServer()
    server: Server

    @UseGuards(JwtAuthGuard)
    async handleConnection(socket: Socket) {
        console.log('HANDLE CONNECTION');
        const jwt = socket.handshake.headers.authorization || null;
        
        try {
            const user = await this.authService.getJwtUser(jwt);
            
            if (!user) {
                console.log('No USER');
                this.handleDisconnect(socket);
            } else {
                socket.data.user = user;
                await this.getConversations(socket, user.id);
            }
        } catch (error) {
            console.error('Error handling connection:', error);
            this.handleDisconnect(socket);
        }
    }

    async getConversations(socket: Socket, userId: number): Promise<void> {
        try {
            const conversations = await this.chatService.getConversationsWithUsers(userId);
            this.server.to(socket.id).emit('conversations', conversations);
        } catch (error) {
            console.error('Error getting conversations:', error);
        }
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        this.chatService.leaveConversation(socket.id)
    }

    @SubscribeMessage('createConversation')
    async createConversation(socket: Socket, friend: any): Promise<void> {
        try {
            await this.chatService.createConversation(socket.data.user, friend);
            this.getConversations(socket, socket.data.user.id);
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    }


    @SubscribeMessage('sendMessage')
    async handleMessage(socket: Socket, newMessage: IMessage) {
        try {
            if (!newMessage.conversation) return null;

            const { user } = socket.data;
            newMessage.user = user;

            if (newMessage.conversation.id) {
                const message = await this.chatService.createMessage(newMessage);

                newMessage.id = message.id;

                const activeConversations = await this.chatService.getActiveUsers(newMessage.conversation.id);

                activeConversations.forEach((activeConversation: ActiveConversation) => {
                    this.server.to(activeConversation.socketId).emit('newMessage', newMessage);
                });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            throw error;
        }
    }


    @SubscribeMessage('joinConversation')
    async joinConversation(socket: Socket, friendId: number): Promise<void> {
        try {
            const activeConversation = await this.chatService.joinConversation(friendId, socket.data.user.id, socket.id);
            const messages = await this.chatService.getMessages(activeConversation.conversationId);
            this.server.to(socket.id).emit('messages', messages);
        } catch (error) {
            console.error('Error joining conversation:', error);
            // Handle error here if needed
        }
    }

    @SubscribeMessage('leaveConversation')
    async leaveConversation(socket: Socket) {
        try {
            await this.chatService.leaveConversation(socket.id);
        } catch (error) {
            console.error('Error leaving conversation:', error);
            throw error;
        }
    }

}
