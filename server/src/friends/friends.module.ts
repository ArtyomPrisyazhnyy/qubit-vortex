import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Friends } from './models/friends.model';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/models/users.model';

@Module({
    providers: [FriendsService],
    controllers: [FriendsController],
    imports: [
        SequelizeModule.forFeature([
            Friends,
            User
        ]),
        UsersModule,
        JwtModule.register({
        secret: jwtConstants.secret || 'SECRET',
        signOptions: { expiresIn: '24h' },
        }),
    ]
})
export class FriendsModule {}
