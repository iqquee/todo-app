// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { hashPassword } from "../utils/password"
import { User } from "../users/dto/user.entity"
import { Admin } from "../admin/dto/admin.entity"
import { UsersService } from 'src/users/users.service';
import { errorResponse, successResponse } from "../utils/response"
import { AdminsService } from 'src/admin/admins.service';
import { loginDto } from "./dto/login.dto"

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private adminsService: AdminsService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login/user')
    async loginUser(@Body() req: loginDto, @Res() res: Response): Promise<Response> {
        try {
            if (req.email === "" && req.password === "") {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "Invalid JSON", null)
            }

            const response = await this.authService.loginUser(req.email, req.password)
            return successResponse(res, HttpStatus.OK, "user login successful", response)
        } catch (error) {
             return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('login/admin')
    async loginAdmin(@Body() req: loginDto, @Res() res: Response): Promise<Response> {
        try {
            if (req.email === "" && req.password === "") {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "Invalid JSON", null)
            }

            const response = await this.authService.loginAdmin(req.email, req.password)
            return successResponse(res, HttpStatus.OK, "admin login successful", response)
        } catch (error) {
             return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }
    }

    @Post('register/user')
    async registerUser(@Body() user: User, @Res() res: Response): Promise<Response> {
        try {
            const foundUser = await this.usersService.findUserByEmail(user.email)
            console.log("user details:", user)
            if (!foundUser) {
                user.password = await hashPassword(user.password)
                const createdUser = await this.usersService.create(user);

                return successResponse(res, HttpStatus.CREATED, "user created successfully", createdUser)
            } else {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "User with email already exists", null)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while creating user", error.message)
        }
    }

    @Post('register/admin')
    async registerAdmin(@Body() admin: Admin, @Res() res: Response): Promise<Response> {
        try {
            const foundUser = await this.adminsService.getAdminByEmail(admin.email)
            if (!foundUser) {
                admin.password = await hashPassword(admin.password)
                const createdUser = await this.usersService.create(admin);

                return successResponse(res, HttpStatus.CREATED, "admin created successfully", createdUser)
            } else {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "admin with email already exists", null)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while creating admin", error.message)
        }
    }
}
