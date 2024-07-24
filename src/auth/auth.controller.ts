// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtUserGuard } from './jwt-user.guard';
import { JwtAdminGuard } from './jwt-admin.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login/user')
    async loginUser(@Request() req) {
        return this.authService.loginUser(req.user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login/admin')
    async loginAdmin(@Request() req) {
        return this.authService.loginAdmin(req.user);
    }

    @Post('register/user')
    async registerUser(@Body() createUserDto: any) {
        return this.authService.registerUser(createUserDto);
    }

    @Post('register/admin')
    async registerAdmin(@Body() createAdminDto: any) {
        return this.authService.registerAdmin(createAdminDto);
    }

    @UseGuards(JwtUserGuard)
    @Post('profile/user')
    getUserProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAdminGuard)
    @Post('profile/admin')
    getAdminProfile(@Request() req) {
        return req.user;
    }
}
