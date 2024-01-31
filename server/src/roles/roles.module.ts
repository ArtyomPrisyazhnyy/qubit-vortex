import { SequelizeModule } from '@nestjs/sequelize';
import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.model';
import { User } from '../users/models/users.model';
import { UserRoles } from './user-roles.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([
            Role, 
            User, 
            UserRoles
        ]),
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
    ],
    exports: [
        RolesService
    ]
})
export class RolesModule {}
