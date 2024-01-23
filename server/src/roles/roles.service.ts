import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService implements OnModuleInit {

    constructor(
        @InjectModel(Role) private roleRepository: typeof Role,
    ){}

    async onModuleInit() {
        try {
            const existingRoles = await this.roleRepository.findAll();
            if (existingRoles.length === 0) {
                this.createRole({ value: 'USER', description: 'User' });
                this.createRole({ value: 'ADMIN', description: 'Administrator' });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async createRole(dto: CreateRoleDto){
        const role = await this.roleRepository.create(dto);
        return role
    }

    async getRoleByValue(value: string){
        const role = await this.roleRepository.findOne({where:{value}});
        return role;
    }

}
