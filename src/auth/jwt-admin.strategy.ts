import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '../admin/admins.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(private adminsService: AdminsService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        const admin = await this.adminsService.getAdminByEmail(payload.email);
        if (!admin) {
            throw new UnauthorizedException();
        }
        return admin;
    }
}
