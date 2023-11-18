import { RolesService } from 'src/roles/roles.service';
import { UserDto } from './../users/dto/user.dto';
import { HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/models/users.model';

@Injectable()
export class AuthService  {
    
    constructor(
        private userService: UsersService,
        private rolesService: RolesService,
        private jwtService: JwtService
    ) { }

    private async createDefaultAdminUser() {
        try {
            const adminRole = await this.rolesService.getRoleByValue('ADMIN');
            const existingAdminUser = await this.userService.getUserByRole(adminRole);
        
            if (!existingAdminUser && adminRole) {
                const adminDto: UserDto = {
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                };
            
                const hashPassword = await bcrypt.hash(adminDto.password, 5);
                const adminUser = await this.userService.createAdminUser({ ...adminDto, password: hashPassword });
                await adminUser.$add('role', adminRole.id); // Связываем пользователя с ролью "админ"
            }
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    }
    
    async login(userDto: UserDto){
        await this.createDefaultAdminUser();

        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto: UserDto): Promise<{ token: string }> {
        await this.createDefaultAdminUser();

        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('A user with this email exists',  HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});
        return this.generateToken(user)
    }

    private async generateToken(user: User): Promise<{ token: string }>{
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: UserDto){
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new UnauthorizedException({message: 'User with this email not found'})
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user?.password);
        if (passwordEquals) {
            return user;
        } 
        throw new UnauthorizedException({message: 'Incorrect password'})
        
    }
}
