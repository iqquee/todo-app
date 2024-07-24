// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admin/admin.module';
import { JwtUserStrategy } from './jwt-user.strategy';
import { JwtAdminStrategy } from './jwt-admin.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';

@Module({
    imports: [
        UsersModule,
        AdminsModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60m' },
        }),
    ],
    providers: [AuthService, JwtUserStrategy, JwtAdminStrategy, LocalStrategy],
    controllers: [AuthController],
})
export class AuthModule { }
