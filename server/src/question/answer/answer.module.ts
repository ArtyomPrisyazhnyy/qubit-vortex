import { Module, forwardRef } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './models/answer.model';
import { FilesModule } from 'src/files/files.module';
import { User } from 'src/users/models/users.model';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { UsersModule } from 'src/users/users.module';
@Module({
    providers: [AnswerService],
    controllers: [AnswerController],
    imports: [
        SequelizeModule.forFeature([User, Answer]),
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: jwtConstants.secret || 'SECRET',
            signOptions: { expiresIn: '24h' },
          }),
        FilesModule
    ]
  })
  export class AnswerModule {}