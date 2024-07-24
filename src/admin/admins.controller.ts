import { Controller, Get, Post, Body, Put, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AdminsService } from './admins.service';
import { UsersService } from '../users/users.service';
import { Admin } from './dto/admin.entity';
import { UpdatePasswordDto } from "./dto/passwordUpdate-entity.dto"
import { hashPassword } from "../utils/password"
import { JwtAdminGuard } from '../auth/jwt-admin.guard';
import { errorResponse, successResponse } from "../utils/response"

@Controller("admin")
export class AdminsController {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly usersService: UsersService,
    ) { }

    // create new admin
    @Post("")
    async createAdmin(@Body() admin: Admin, @Res() res: Response): Promise<Response> {
        try {
            // first check if an admin with corresponding email already exists
            const foundAdmin = await this.adminsService.getAdminByEmail(admin.email)
            if (!foundAdmin) {
                const newAdmin = await this.adminsService.createAdmin(admin)
                
                return successResponse(res, HttpStatus.CREATED, "Admin created succesfully", newAdmin)
            } else {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "User with email already exists", null)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.BAD_REQUEST, "UAn error occurred while creating admin", null)
        }
    }

    @UseGuards(JwtAdminGuard)
    @Post("/create")
    async addAdmin(@Body() admin: Admin, @Res() res: Response): Promise<Response> {
        try {
            const foundAdmin = await this.adminsService.getAdminByEmail(admin.email)
            if (!foundAdmin) {
                const newAdmin = await this.adminsService.createAdmin(admin)
                
                return successResponse(res, HttpStatus.CREATED, "Admin created succesfully", newAdmin)
            } else {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "User with email already exists", null)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.BAD_REQUEST, "An error occurred while creating admin", null)
        }
    }

    // @Post("/login")
    // async login(@Body() loginRequest: LoginDto, @Res() res: Response): Promise<Response> {
    //     try {
    //         const foundUser = await this.adminsService.getAdminByEmail(loginRequest.email)
    //         // compare passwords
    //         if (foundUser && comparePasswords(loginRequest.password, foundUser.password)) {
    //             return successResponse(res, HttpStatus.CREATED, "Admin created succesfully", newAdmin)
    //             res.status(HttpStatus.OK).json({
    //                 message: "login successful",
    //                 admin: foundUser,
    //                 token: null,
    //             })
    //         } else {
    //             return res.status(HttpStatus.BAD_REQUEST).json({
    //                 message: 'Please review you login details and try again',
    //                 error: null,
    //             });
    //         }
    //     } catch (error) {
    //         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //             message: 'An error occurred while updating profile',
    //             error: error.message,
    //         });
    //     }
    // }


    @UseGuards(JwtAdminGuard)
    @Put(":id")
    async updateAdminDetails(@Param() id: number, @Body() admin: Admin, @Res() res: Response): Promise<Response> {
        try {
            const updatedUser = await this.adminsService.updateDetails(id, admin)
            return successResponse(res, HttpStatus.OK, "Profile updated successfully", updatedUser)
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while updating profile',
                error: error.message,
            });
        }

    }

    @UseGuards(JwtAdminGuard)
    @Put("/security/password/:id")
    async updatePassword(@Param() id: number, @Body() pass: UpdatePasswordDto, @Res() res: Response): Promise<Response> {
        try {
            const hashedPassword = await hashPassword(pass.password); // Await the hashed password
            const admin: Partial<Admin> = {
                password: hashedPassword,
            };

            // Await the result of the update operation
            const updatedAdmin = await this.adminsService.updateDetails(id, admin);
            return successResponse(res, HttpStatus.OK, "Admin password updated successfully", updatedAdmin)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the password", error.message)
        }
    }

    @UseGuards(JwtAdminGuard)
    @Get("/user/users")
    async getAllUsers(@Res() res: Response): Promise<Response> {
        try {
            const users = this.usersService.findAll()
            return successResponse(res, HttpStatus.OK, "Users retrieved successfully", users)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieving users", error.message)
        }
    }
}