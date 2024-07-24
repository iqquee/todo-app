import { Controller, Get, Post, Body, Put, Param, Res, HttpStatus , UseGuards} from '@nestjs/common';
import { Response } from 'express';
import { AdminsService } from './admins.service';
import { UsersService } from '../users/users.service';
import { Admin } from './dto/admin.entity';
import { UpdatePasswordDto } from "./dto/passwordUpdate-entity.dto"
import { LoginDto } from "./dto/login-entity.dto"
import { comparePasswords, hashPassword } from "../utils/password"
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/dto/user.entity';
import { JwtAdminGuard } from '../auth/jwt-admin.guard';

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
                const adm : Admin = {
                    ...admin,
                    role: "admin" // set role
                }
                
                const newAdmin = await this.adminsService.createAdmin(adm)
                return res.status(HttpStatus.CREATED).json({
                    message: "admin created succesfully",
                    admin: newAdmin,
                })
            } else {
                return res.status(HttpStatus.CONFLICT).json({
                    message: 'User with email already exists'
                });

            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while creating admin',
                error: error.message,
            });
        }
    }

    @Post("/login")
    async login(@Body() loginRequest: LoginDto, @Res() res: Response): Promise<Response> {
        try {
            const foundUser = await this.adminsService.getAdminByEmail(loginRequest.email)
            // compare passwords
            if (foundUser && comparePasswords(loginRequest.password, foundUser.password)) {
                res.status(HttpStatus.OK).json({
                    message: "login successful",
                    admin: foundUser,
                    token: null,
                })
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Please review you login details and try again',
                    error: null,
                });
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while updating profile',
                error: error.message,
            });
        }
    }


    @UseGuards(JwtAdminGuard)
    @Put(":id")
    async updateAdminDetails(@Param() id: number, @Body() admin: Admin, @Res() res: Response): Promise<Response> {
        try {
            const updatedUser = await this.adminsService.updateDetails(id, admin)
            return res.status(HttpStatus.OK).json({
                message: "profile updated successfully",
                admin: updatedUser,
            })
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

            return res.status(HttpStatus.OK).json({
                message: 'Admin password updated successfully',
                admin: updatedAdmin,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while updating the password',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAdminGuard)
    @Get("/user/users")
    async getAllUsers(@Res() res: Response): Promise<Response> {
        try {
            const users = this.usersService.findAll()
            return res.status(HttpStatus.OK).json({
                message: "users retrieved successfully",
                users: users
            })
        } catch (error) {
            return res.status(HttpStatus.OK).json({
                message: 'An error occurred while retrieving users',
                error: error.message,
            })
        }
    }
}