import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret || 'SECRET',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService],
  exports: [
    AuthService,
    JwtModule
  ],
  controllers: [AuthController]
})
export class AuthModule {}
