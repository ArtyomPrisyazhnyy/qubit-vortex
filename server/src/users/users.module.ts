import { SequelizeModule } from '@nestjs/sequelize';
import { forwardRef, Module } from '@nestjs/common';
import { User } from './models/users.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { Question } from 'src/question/models/question.model';
import { QuestionModule } from 'src/question/question.module';
import { FilesModule } from 'src/files/files.module';
import { FriendsModule } from 'src/friends/friends.module';
import { Friends } from 'src/friends/models/friends.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User, 
      Role, 
      UserRoles, 
      Question, 
      Friends
    ]),
    RolesModule,
    FilesModule,
    forwardRef(() => AuthModule),
    forwardRef(() => QuestionModule)
  ],
  exports: [UsersService]
})
export class UsersModule {}
