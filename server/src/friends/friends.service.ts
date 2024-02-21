import { HttpException, HttpStatus, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friends } from './models/friends.model';
import { User } from 'src/users/models/users.model';
import { AddFriendDto } from './dto/friends.dto';
import { Error, Op, Sequelize } from 'sequelize';

export enum FriendsCriteria {
    AllFriends = 'All friends',
    FriendsRequests = 'Friends requests'
}

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friends) private friendsRepository: typeof Friends,
        @InjectModel(User) private userRepository: typeof User
    ) {}


    async sendFriendRequest(userId: number, friendId: number){
        const alreadyCreated = await this.friendsRepository.findOne({
            where: {
                [Op.or]: [
                    {userId, friendId},
                    {userId: friendId, friendId: userId}
                ],
            }
        })
        if(alreadyCreated){
            throw new HttpException('Forbidden: the record already exists in the database', HttpStatus.FORBIDDEN);
        }
        const friendReq = await this.friendsRepository.create({
            friendId,
            userId,
            status: 'pending',
        });
        return friendReq;
    }


    async acceptFriendRequest(userId: number, friendId: number) {
        const friendRequest = await this.friendsRepository.findOne({
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
        const friendRequest = await this.friendsRepository.findOne({
            where: {
                userId: friendId,
                friendId: userId,
                status: 'pending'
            },
        });
        if (!friendRequest) {
            throw new NotFoundException('Friend request not found');
        }

        friendRequest.status = 'rejected';
        await friendRequest.save();
    }

    async Unfriend(userId: number, friendId: number){
        const friendStatus = await this.friendsRepository.destroy({
            where: {
                [Op.or]: [
                    {userId, friendId},
                    {userId: friendId, friendId: userId}
                ],
                status: 'accepted'
            }
        });
        if (!friendStatus) {
            throw new NotFoundException('Friend request not found');
        }

        return friendStatus
    }


    async getFriendsRequestCount(userId: number) {
        const requestCount = await this.friendsRepository.count({
            where: {
                friendId: userId,
                status: 'pending'
            }
        });
        return requestCount 
    }


    async getAllFriends(
        userId: number, 
        searchFriend: string,
        friendsCriteria: FriendsCriteria
    ) {
        if (!friendsCriteria || friendsCriteria === FriendsCriteria.AllFriends){
            const friends = await this.friendsRepository.findAll({
                where: { 
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { userId: userId },
                                { friendId: userId },
                            ],
                        },
                        {
                            [Op.or]: [
                                Sequelize.where(
                                    Sequelize.fn('LOWER', Sequelize.col('User.nickname')),
                                    'LIKE',
                                    `${searchFriend.toLowerCase()}%`
                                ),
                                Sequelize.where(
                                    Sequelize.fn('LOWER', Sequelize.col('Friend.nickname')),
                                    'LIKE',
                                    `${searchFriend.toLowerCase()}%`
                                )
                            ]
                        },
                        { status: 'accepted' }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: "User"
                    },
                    {
                        model: User,
                        as: "Friend"
                    }
                ]
            });
    
            const friendUserIds = friends.map((friend: any) => {
                return friend.userId === userId ? friend.friendId : friend.userId;
            });
            const users = await this.userRepository.findAll({
                where: { id: friendUserIds },
                attributes: ['id', 'nickname', 'avatar', 'country'], 
            });
    
            return users;
        }

        if(friendsCriteria === FriendsCriteria.FriendsRequests){
            const friendRequests = await this.friendsRepository.findAll({
                where: { 
                    friendId: userId, 
                    status: 'pending', 
                },
                include: [{
                    model: User,
                    as: 'User',
                    attributes: ['id', 'nickname', 'avatar']
                }]
            });
    
            const friendRequestUserIds = friendRequests.map((request) => request.userId);
            const users = await User.findAll({
                where: { id: friendRequestUserIds },
                attributes: ['id', 'nickname', 'avatar', 'country'],
            });
    
            return users;
        }
        
    }

}
