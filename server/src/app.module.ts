import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { User } from './users/models/users.model';
import { UserRoles } from './roles/user-roles.model';
import { Role } from './roles/roles.model';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { Question } from './question/models/question.model';
import { FilesModule } from './files/files.module';
import { AnswerModule } from './question/answer/answer.module';
import { Answer } from './question/answer/models/answer.model';
import { Friends } from './friends/models/friends.model';
import { FriendsModule } from './friends/friends.module';
//import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        UserRoles,
        Role,
        Question,
        Answer,
        Friends
      ],
      autoLoadModels: true,
      synchronize: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    QuestionModule,
    FilesModule,
    AnswerModule,
    FriendsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
   // AppGateway,
  ],
})
export class AppModule {}
