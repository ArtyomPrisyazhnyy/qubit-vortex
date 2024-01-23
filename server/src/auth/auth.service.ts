import { RolesService } from 'src/roles/roles.service';
import { UserDto } from './../users/dto/user.dto';
import { HttpException, HttpStatus, Injectable, OnModuleInit, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/models/users.model';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegistrationDto } from './dto/auth-registration.dto';

@Injectable()
export class AuthService implements OnModuleInit  {
    
    constructor(
        private userService: UsersService,
        private rolesService: RolesService,
        private jwtService: JwtService
    ) { }

    async onModuleInit() {
        try {
            const adminRole = await this.rolesService.getRoleByValue('ADMIN');
            const existingAdminUser = await this.userService.getUserByRole(adminRole);
        
            if (!existingAdminUser && adminRole) {
                const adminDto = {
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                    nickname: "Administrator"
                };
            
                const hashPassword = await bcrypt.hash(adminDto.password, 5);
                const adminUser = await this.userService.createAdminUser({ ...adminDto, password: hashPassword });
                await adminUser.$add('role', adminRole.id); // Связываем пользователя с ролью "админ"
            }
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    }


    
    async login(authLoginDto: AuthLoginDto): Promise<{ token: string }>{

        const user = await this.validateUser(authLoginDto)
        return this.generateToken(user)
    }


    async registration(authRegistrationDto: AuthRegistrationDto): Promise<{ token: string }> {

        const candidate = await this.userService.getUserByEmail(authRegistrationDto.email);
        if (candidate) {
            throw new HttpException('A user with this email exists',  HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(authRegistrationDto.password, 5);
        const user = await this.userService.createUser({...authRegistrationDto, password: hashPassword});
        return this.generateToken(user);
    }

    private async generateToken(user: User): Promise<{ token: string }>{
        const payload = {email: user.email, id: user.id, avatar: user.avatar, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(authLoginDto: AuthLoginDto){
        const user = await this.userService.getUserByEmail(authLoginDto.email);
        if (!user) {
            throw new UnauthorizedException({message: 'User with this email not found'})
        }
        const passwordEquals = await bcrypt.compare(authLoginDto.password, user?.password);
        if (passwordEquals) {
            return user;
        } 
        throw new UnauthorizedException({message: 'Incorrect password'})
        
    }
}
