import { UserDto } from 'src/users/dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegistrationDto } from './dto/auth-registration.dto';

@ApiTags("Authorization")
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @ApiOperation({summary: 'Login'})
    @Post("/login")
    login(@Body() authLoginDto: AuthLoginDto){
        return this.authService.login(authLoginDto);
    }

    @ApiOperation({summary: 'Registration'})
    @Post("/registration")
    registration(@Body() authRegistrationDto: AuthRegistrationDto){
        return this.authService.registration(authRegistrationDto);
    }
}

