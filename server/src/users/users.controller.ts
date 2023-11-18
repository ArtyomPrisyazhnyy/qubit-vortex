import { UsersService } from './users.service';
import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models/users.model';
import { UserDto } from './dto/user.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    
    constructor(
        private  UsersService: UsersService
    ){}

    @ApiOperation({summary: 'Creating a user'})
    @ApiResponse({status: 200, type: User})
    @Post()
    create(@Body() userDto: UserDto){
        return this.UsersService.createUser(userDto);
    }


    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll(){
        return this.UsersService.getAllUsers();
    }
}
