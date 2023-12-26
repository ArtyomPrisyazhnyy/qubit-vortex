import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friends } from './models/friends.model';
import { User } from 'src/users/models/users.model';
import { AddFriendDto } from './dto/friends.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends)
    private friendsModel: typeof Friends,
  ) {}

  async sendFriendRequest(userId: number, dto: AddFriendDto): Promise<void> {
    await this.friendsModel.create({
        ...dto,
        userId,
        isAccepted: false,
    });
  }

  async acceptFriendRequest(userId: number, friendId: number): Promise<void> {
    
    const friendRequest = await this.friendsModel.findOne({
        where: { userId: friendId, friendId: userId, isAccepted: false },
    });

    if (!friendRequest) {
        throw new NotFoundException('Friend request not found');
    }

    friendRequest.isAccepted = true;
    await friendRequest.save();
  }

  async declineFriendRequest(userId: number, friendId: number): Promise<void> {
    await this.friendsModel.destroy({
        where: { userId: friendId, friendId: userId, isAccepted: false },
    });
  }

  async getFriendRequests(userId: number): Promise<User[]> {
    const friendRequests = await this.friendsModel.findAll({
        where: { friendId: userId, isAccepted: false },
    });

    const friendRequestUserIds = friendRequests.map((request) => request.userId);
    const users = await User.findAll({
        where: { id: friendRequestUserIds },
        attributes: ['id', 'nickname', 'avatar'],
    });

    return users;
  }

  async getFriends(userId: number): Promise<User[]> {
    const friends = await this.friendsModel.findAll({
        where: { userId, isAccepted: true },
    });

    const friendUserIds = friends.map((friend: any) => friend.friendId);
    const users = await User.findAll({
        where: { id: friendUserIds },
        attributes: ['id', 'nickname', 'avatar'], 
    });

    return users;
  }
}
