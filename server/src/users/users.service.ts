import { RolesService } from './../roles/roles.service';
import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import {Role} from '../roles/roles.model';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {

    constructor(
      @InjectModel(User) private userRepository: typeof User, 
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

    async getAllUsers(req: any) {
        let {limit} = req.query;
        limit = limit || 20;
        const users = await this.userRepository.findAll({
            attributes: {
                exclude: [
                    'email',
                    'password',
                    'createdAt',
                    'updatedAt'
                ]
            }
        });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } })
        return user;
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({ where: { id }, include: { all: true } })
        return user;
    }    

    async updateUserInfo(dto: UpdateUserInfoDto, userId: number, image: any, /*excludeFields: string[]*/){
      const user = await this.getUserById(userId);

      user.nickname = dto.nickname;
      if (image) {
        user.avatar = await this.fileService.createFile(image);
      }
      
      await user.save();
      const updatedUser = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.roles,
      };
      return updatedUser
    }
}
