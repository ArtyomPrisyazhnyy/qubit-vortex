import { Controller, Post, Param, UseGuards, Get, Body, Req, Delete, Put, Query, Patch } from '@nestjs/common';
import { FriendsCriteria, FriendsService } from './friends.service';
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
    ) {
        const userId = req.user.id;
        const friendId = dto.friendId
        return this.friendsService.sendFriendRequest(userId, friendId);
    }

    @ApiOperation({summary: "Accept friend request"})
    @UseGuards(JwtAuthGuard)
    @Patch('accept-request')
    acceptFriendRequest(
        @Body() dto: AddFriendDto,
        @Req() req: any,
    ) {
        const userId = req.user.id;
        const friendId = dto.friendId
        return this.friendsService.acceptFriendRequest(userId, friendId);
    }

    @ApiOperation({summary: "Decline friend request"})
    @UseGuards(JwtAuthGuard)
    @Patch('decline-request')
    declineFriendRequest(
        @Req() req: any,
        @Body() dto: AddFriendDto,
    ){
        const userId = req.user.id;
        const friendId = dto.friendId
        return this.friendsService.declineFriendRequest(userId, friendId);
    }

    @ApiOperation({summary: "Unfriend"})
    @UseGuards(JwtAuthGuard)
    @Delete('unfriend/:id')
    Unfriend(
        @Req() req: any,
        @Param('id') friendId: number,
    ){
        const userId = req.user.id;
        return this.friendsService.Unfriend(userId, friendId);
    }

    @ApiOperation({summary: "Get friend request cound"})
    @UseGuards(JwtAuthGuard)
    @Get('requests-count')
    getRequestsCount(
        @Req() req: any
    ){
        const userId = req.user.id
        return this.friendsService.getFriendsRequestCount(userId)
    }

    @ApiOperation({summary: "Get all friends"})
    @UseGuards(JwtAuthGuard)
    @Get('list')
    getFriends(
        @Req() req: any,
        @Query('searchFriend') searchFriend: string = '',
        @Query('friendsCriteria') friendsCriteria: FriendsCriteria = FriendsCriteria.AllFriends
    ) {
        const userId = req.user.id;
        return this.friendsService.getAllFriends(userId, searchFriend, friendsCriteria);
    }
}
