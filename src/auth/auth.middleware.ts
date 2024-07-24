// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { AdminsService } from '../admin/admins.service';
import { CustomRequest } from './custom-request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private adminsService: AdminsService,
    ) { }

    async use(req: CustomRequest, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const payload = this.jwtService.verify(token, { secret: jwtConstants.secret });
                if (payload.role === 'user') {
                    req.user = await this.usersService.findUserByEmail(payload.email);
                } else if (payload.role === 'admin') {
                    req.user = await this.adminsService.getAdminByEmail(payload.email);
                }
            } catch (e) {
                console.error(e);
            }
        }
        next();
    }
}
