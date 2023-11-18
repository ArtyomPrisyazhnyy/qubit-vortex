import { RolesService } from './../roles/roles.service';
import { UserDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import {Role} from '../roles/roles.model';

@Injectable()
export class UsersService {

    constructor(
      @InjectModel(User) private userRepository: typeof User, 
      private roleService: RolesService
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

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: { all: true } });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } })
        return user;
    }
}
