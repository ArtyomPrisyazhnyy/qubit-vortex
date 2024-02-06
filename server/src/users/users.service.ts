import { RolesService } from './../roles/roles.service';
import { UserDto } from './dto/user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import {Role} from '../roles/roles.model';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { FilesService } from 'src/files/files.service';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { Friends } from 'src/friends/models/friends.model';

export interface UserWithFriendshipStatus {
    id: number;
    nickname: string;
    avatar: string;
    country: string;
    isPrivate: boolean,
    isFriend: boolean;
    isRequestSender: boolean;
    areYouSender: boolean
}

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Friends) private friendsRepository: typeof Friends, 
        private roleService: RolesService,
        private fileService: FilesService
    ) { }

    async createUser(dto: UserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("USER");
        console.log("роль " + role)
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user;
    }

    async createAdminUser(dto: UserDto) {
        const adminRole = await this.roleService.getRoleByValue('ADMIN');
        
        const user = await this.userRepository.create(dto);
        await user.$set('roles', [adminRole.id]);
        
        return user;
    }

    async getUserByRole(role: Role): Promise<User | null> {
        const users = await this.userRepository.findAll({
            include: [
                {
                    model: Role,
                    where: { id: role.id },
                },
            ],
        });
        return users.length ? users[0] : null;
    }

    async getAllUsers(
        pageSize: string, 
        searchUser: string, 
        userId: number
    ): Promise<UserWithFriendshipStatus[]> {
        const limit = parseInt(pageSize, 10) || 15;
        const whereCondition: WhereOptions<any> = {
            nickname: { [Op.iLike]: `${searchUser}%` },
        };
    
        const users = await this.userRepository.findAll({
            limit,
            where: whereCondition,
            attributes: ['id', 'nickname', 'avatar', 'country', 'isPrivate'],
        });
        
        const usersWithStatus: UserWithFriendshipStatus[] = [];
    
        for (const user of users) {
            const isFriend = await this.isUserFriend(userId, user.id);
            const isRequestSender = await this.isUserRequestSender(user.id, userId);
            const areYouSender = await this.isUserRequestSender(userId, userId);
    
            const userWithStatus: UserWithFriendshipStatus = {
                id: user.id,
                nickname: user.nickname,
                avatar: user.avatar,
                country: user.country,
                isPrivate: user.isPrivate,
                isFriend,
                isRequestSender,
                areYouSender
            };
    
            usersWithStatus.push(userWithStatus);
        }
    
        return usersWithStatus;
    }
    
    async isUserFriend(userId: number, friendId: number): Promise<boolean> {
        const friendship = await this.friendsRepository.findOne({
            where: {
                [Op.or]: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
                status: 'accepted',
            }
        });
    
        return !!friendship;
    }
    
    async isUserRequestSender(userId: number, friendId: number): Promise<boolean> {
        const friendshipRequest = await this.friendsRepository.findOne({
            where: {
                userId,
                friendId,
                status: 'pending',
            }
        });
    
        return !!friendshipRequest;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });

        return user;
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            attributes: {
                exclude: [
                    'email',
                    'password',
                    'createdAt',
                    'updatedAt'
                ]
            }
        })

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
    
    async updateUserInfo(dto: UpdateUserInfoDto, userId: number, image: any){
        const user = await this.getUserById(userId);
        if (!user){
            throw new NotFoundException('User not found');
        }

        if (image){
            user.avatar = await this.fileService.createFile(image);
        }
        if (dto.nickname){
            user.nickname = dto.nickname;
        }
        if (dto.country){
            user.country = dto.country;
        }
        if (dto.aboutMe){
            user.aboutMe = dto.aboutMe;
        }
        if (dto.links){
            user.links = dto.links;
        }
      
        await user.save();
        const userWithoutUpdatedAt = user.toJSON();
        delete userWithoutUpdatedAt.updatedAt;

        return userWithoutUpdatedAt;
    }
}
