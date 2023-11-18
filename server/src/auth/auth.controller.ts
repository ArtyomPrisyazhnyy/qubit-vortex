import { UserDto } from 'src/users/dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags("Authorization")
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @ApiOperation({summary: 'Login'})
    @Post("/login")
    login(@Body() userDto: UserDto){
        return this.authService.login(userDto);
    }

    @ApiOperation({summary: 'Registration'})
    @Post("/registration")
    registration(@Body() userDto: UserDto){
        return this.authService.registration(userDto);
    }
}

