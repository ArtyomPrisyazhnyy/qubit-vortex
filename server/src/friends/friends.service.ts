import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friends } from './models/friends.model';
import { User } from 'src/users/models/users.model';
import { AddFriendDto } from './dto/friends.dto';
import { Op } from 'sequelize';


@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friends)
        private friendsModel: typeof Friends,
    ) {}


    async sendFriendRequest(userId: number, dto: AddFriendDto){
        await this.friendsModel.create({
            ...dto,
            userId,
            status: 'pending',
        });
    }


    async acceptFriendRequest(userId: number, friendId: number) {
        const friendRequest = await this.friendsModel.findOne({
            where: {
                userId: friendId,
                friendId: userId,
                [Op.or]: [
                    { status: 'pending' },
                    { status: 'rejected' },
                ],
            },
        });
        if (!friendRequest) {
            throw new NotFoundException('Friend request not found');
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();
    }


    async declineFriendRequest(userId: number, friendId: number){
        const friendRequest = await this.friendsModel.findOne({
            where: {
                userId: friendId,
                friendId: userId,
                [Op.or]: [
                    { status: 'pending' },
                    { status: 'accepted' },
                ],
            },
        });
        if (!friendRequest) {
            throw new NotFoundException('Friend request not found');
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();
    }


    async getFriendRequests(userId: number) {
        const friendRequests = await this.friendsModel.findAll({
            where: { 
                friendId: userId, 
                status: 'accepted', 
            },
            include: [{
                model: User,
                attributes: ['id', 'nickname', 'avatar']
            }]
        });

        const friendRequestUserIds = friendRequests.map((request) => request.userId);
        const users = await User.findAll({
            where: { id: friendRequestUserIds },
            attributes: ['id', 'nickname', 'avatar'],
        });

        return users;
    }


    async getAllFriends(userId: number) {
        const friends = await this.friendsModel.findAll({
            where: { 
                [Op.or]: [
                    { userId: userId },
                    { friendId: userId },
                ],
                status: 'accepted' 
            },
        });

        const friendUserIds = friends.map((friend: any) => friend.friendId);
        const users = await User.findAll({
            where: { id: friendUserIds },
            attributes: ['id', 'nickname', 'avatar'], 
        });

        return users;
    }
}
