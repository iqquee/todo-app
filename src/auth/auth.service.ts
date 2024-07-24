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

    async loginUser(user: any) {
        const payload = { email: user.email, sub: user.id, role: 'user' };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async loginAdmin(admin: any) {
        const payload = { email: admin.email, sub: admin.id, role: 'admin' };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registerUser(user: Partial<User>) {
        return this.usersService.create(user);
    }

    async registerAdmin(admin: Partial<Admin>) {
        return this.adminsService.createAdmin(admin);
    }
}
