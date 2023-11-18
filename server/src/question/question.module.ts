import { Module, forwardRef } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/users.model';
import { Question } from './models/question.model';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { FilesModule } from 'src/files/files.module';

@Module({
  providers: [QuestionService],
  controllers: [QuestionController],
  imports: [
    SequelizeModule.forFeature([User, Question]),
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: jwtConstants.secret || 'SECRET',
      signOptions: { expiresIn: '24h' },
    }),
    FilesModule,
  ]
})
export class QuestionModule {}
