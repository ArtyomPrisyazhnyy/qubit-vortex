import { Controller, Post, Param, UseGuards, Get, Body, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/models/users.model';
import { AddFriendDto } from './dto/friends.dto';


@ApiTags("Friends")
@Controller('friends')
export class FriendsController {

    constructor(
        private friendsService: FriendsService
    ) {}

    @ApiOperation({summary: 'Send a request to become friends'})
    @Post('send-request')
    @UseGuards(JwtAuthGuard)
    sendFriendRequest(
        @Body() dto: AddFriendDto,
        @Req() req: any,
        //@Param('friendId') friendId: number,
    ): Promise<void> {
        const userId = req.user.id;
        return this.friendsService.sendFriendRequest(userId, dto);
    }

    @ApiOperation({summary: "Accept friend request"})
    @UseGuards(JwtAuthGuard)
    @Post('accept-request')
    acceptFriendRequest(
        @Body() dto: AddFriendDto,
        @Req() req: any,
    ): Promise<void> {
        const userId = req.user.id;
        const friendId = dto.friendId
        return this.friendsService.acceptFriendRequest(userId, friendId);
    }

    @ApiOperation({summary: "Decline friend request"})
    @UseGuards(JwtAuthGuard)
    @Post('decline-request/:friendId')
    declineFriendRequest(
        @Body() dto: AddFriendDto,
        @Req() req: any,
    ): Promise<void> {
        const userId = req.user.id;
        const friendId = dto.friendId;
        return this.friendsService.declineFriendRequest(userId, friendId);
    }

    @ApiOperation({summary: "Get friend requests"})
    @UseGuards(JwtAuthGuard)
    @Get('requests')
    getFriendRequests(
        @Req() req: any
    ): Promise<User[]> {
        const userId = req.user.id;
        return this.friendsService.getFriendRequests(userId);
    }

    @ApiOperation({summary: "Get all friends"})
    @UseGuards(JwtAuthGuard)
    @Get('list')
    getFriends(
        @Req() req: any
    ): Promise<User[]> {
        const userId = req.user.id;
        return this.friendsService.getFriends(userId);
    }
}
