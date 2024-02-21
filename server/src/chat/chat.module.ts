import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './gateaway/chat/chat.gateway';
import { ChatService } from './chat.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { Conversation } from './models/conversation.model';
import { ActiveConversation } from './models/active-conversation.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [ChatGateway, ChatService],
    imports: [
        SequelizeModule.forFeature([
            Message,
            Conversation,
            ActiveConversation
        ]),
        forwardRef(() => AuthModule)
    ]
})
export class ChatModule {}
