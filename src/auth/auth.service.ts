import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminsService } from '../admin/admins.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from "../users/dto/user.entity"
import { Admin } from "../admin/dto/admin.entity"

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private adminsService: AdminsService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findUserByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async validateAdmin(email: string, password: string): Promise<any> {
        const admin = await this.adminsService.getAdminByEmail(email);
        if (admin && (await bcrypt.compare(password, admin.password))) {
            const { password, ...result } = admin;
            return result;
        }
        return null;
    }

    async loginUser(email: string, password: string) {
        const user = await this.validateUser(email, password)
        const token = this.jwtService.sign(email)

        return {
            user: user,
            token: token,
        }
    }

    async loginAdmin(email: string, password: string) {
        const admin = await this.validateAdmin(email, password)
        const token = this.jwtService.sign(email)

        return {
            admin: admin,
            token: token,
        }
    }

    async registerUser(user: User) {
        return this.usersService.create(user);
    }

    async registerAdmin(admin: Admin) {
        return this.adminsService.createAdmin(admin);
    }
}
