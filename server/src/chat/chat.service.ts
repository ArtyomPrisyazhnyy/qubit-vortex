import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Conversation } from './models/conversation.model';
import { ActiveConversation } from './models/active-conversation.model';
import { Message } from './models/message.model';
import { User } from 'src/users/models/users.model';
import { Sequelize } from 'sequelize';
import { IConversation } from './models/conversation.interface';
import { IMessage } from './models/message.interface';
import { IActiveConversation } from './models/active-conversation.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Conversation) private conversationRepository: typeof Conversation,
        @InjectModel(ActiveConversation) private activeConversationRepository: typeof ActiveConversation,
        @InjectModel(Message) private messageRepository: typeof Message,
    ){}

    async getConversation(
        creatorId: number, 
        friendId: number
    ): Promise<IConversation | undefined> {
        try {
            const conversation = await this.conversationRepository.findOne({
                include: [{
                    model: User,
                    where: {
                        id: [creatorId, friendId] 
                    }
                }],
                group: 'conversation.id',
                having: Sequelize.literal('COUNT(*) > 1') // Условие HAVING для подсчета пользователей
            });
            return conversation || undefined;
        } catch (error) {
            console.error('Error retrieving conversation:', error);
            return undefined;
        }
    }

    async createConversation(
        creator: User, 
        friend: User
    ): Promise<IConversation> {
        try {
            const conversation = await this.getConversation(creator.id, friend.id);

            if (!conversation) {
                const newConversation = await this.conversationRepository.create({
                    users: [creator, friend], 
                });
                return newConversation;
            } 
            return conversation;
            
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    async getConversationsForUser(userId: number): Promise<IConversation[]> {
        try {
            const conversations = await this.conversationRepository.findAll({
                include: [
                    {
                        model: User,
                        where: { id: userId }
                    }
                ],
                order: [['lastUpdated', 'DESC']]
            });
            return conversations;
        } catch (error) {
            console.error('Error fetching conversations for user:', error);
            throw error;
        }
    }
    
    
    async getUsersInConversation(conversationId: number): Promise<IConversation[]> {
        try {
            const conversation = await this.conversationRepository.findOne({
                where: { id: conversationId },
                include: [{ model: User, as: 'users' }],
            });
            return conversation ? [conversation] : [];
        } catch (error) {
            console.error('Error fetching users in conversation:', error);
            throw error;
        }
    }
    
    async getConversationsWithUsers(userId: number): Promise<IConversation[]> {
        try {
            // Получаем беседы пользователя
            const conversations = await this.getConversationsForUser(userId);
    
            // Создаем массив промисов для получения пользователей в каждой беседе
            const usersPromises = conversations.map(async (conversation: Conversation) => {
                const users = await this.getUsersInConversation(conversation.id);
                return users[0]; // Возвращаем только первую беседу с пользователями
            });
    
            // Ждем завершения всех промисов и возвращаем массив бесед с пользователями
            const conversationsWithUsers = await Promise.all(usersPromises);
            return conversationsWithUsers;
        } catch (error) {
            console.error('Error fetching conversations with users:', error);
            throw error;
        }
    }

    async joinConversation(
        friendId: number,
        userId: number,
        socketId: string,
      ): Promise<ActiveConversation> {
        try {
            const conversation = await this.getConversation(userId, friendId);
            if (!conversation) {
                console.warn(
                    `No conversation exists for userId: ${userId} and friendId: ${friendId}`,
                );
                return;
            }
            const conversationId = conversation.id;
    
            const activeConversation = await this.activeConversationRepository.findOne({ where: { userId } });
    
            if (activeConversation) {
                await this.activeConversationRepository.destroy({ where: { userId } });
            }
    
            return await this.activeConversationRepository.create({
                socketId,
                userId,
                conversationId,
            });
        } catch (error) {
            console.error('Error joining conversation:', error);
            throw error;
        }
    }

    async leaveConversation(socketId: string): Promise<void> {
        try {
            await this.activeConversationRepository.destroy({ 
                where: { socketId } 
            });
        } catch (error) {
            console.error('Error leaving conversation:', error);
            throw error;
        }
    }

    async getActiveUsers(conversationId: number): Promise<IActiveConversation[]> {
        try {
            const activeUsers = await this.activeConversationRepository.findAll({
                where: { conversationId },
            });
            return activeUsers;
        } catch (error) {
            console.error('Error fetching active users:', error);
            throw error;
        }
    }
    

    createMessage(message: IMessage): Promise<IMessage> {
        return this.messageRepository.create(message);
    }
    
    
    async getMessages(conversationId: number): Promise<IMessage[]> {
        try {
            const messages = await this.messageRepository.findAll({
                where: { conversationId },
                include: { model: User, as: 'user' },
                order: [['createdAt', 'ASC']],
            });
            return messages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }
    
    
    async removeActiveConversations(): Promise<void> {
        try {
            await this.activeConversationRepository.destroy({ truncate: true });
        } catch (error) {
            console.error('Error removing active conversations:', error);
            throw error;
        }
    }
    
    async removeMessages(): Promise<void> {
        try {
            await this.messageRepository.destroy({ where: {} });
        } catch (error) {
            console.error('Error removing messages:', error);
            throw error;
        }
    }
    
    async removeConversations(): Promise<void> {
        try {
            await this.conversationRepository.destroy({ where: {} });
        } catch (error) {
            console.error('Error removing conversations:', error);
            throw error;
        }
    }
    
}
