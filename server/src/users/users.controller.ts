import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Put, Req, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models/users.model';
import { UserDto } from './dto/user.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    
    constructor(
        private  UsersService: UsersService
    ){}

    @ApiOperation({summary: 'Creating a user'})
    @ApiResponse({status: 200, type: User})
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(
        @Body() userDto: UserDto
    ){
        return this.UsersService.createUser(userDto);
    }


    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(@Request() req: any){
        return this.UsersService.getAllUsers(req);
    }

    @ApiOperation({summary: 'Update user info'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Put()
    updateUserInfo(
        @Body() updateUserInfoDto: UpdateUserInfoDto,
        @Req() req: any,
        @UploadedFile() image: any
    ){
        const userId = req.user.id;
        //const excludeFields = req.body.excludeFields || []

        return this.UsersService.updateUserInfo(updateUserInfoDto, userId, image  /*excludeFields*/)
    }
}
