import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './dto/user.entity';
import { hashPassword } from "../utils/password"
import { JwtUserGuard } from '../auth/jwt-user.guard';
import { Response } from 'express';
import { errorResponse, successResponse } from "../utils/response"

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    //get all users
    @UseGuards(JwtUserGuard) // add middleware
    @Get("/user/users")
    async findAll(@Res() res: Response): Promise<Response> {
        try {
            const users = await this.usersService.findAll();
            return successResponse(res, HttpStatus.OK, "users retrieved successfully", users)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }
    }

    //get user by email
    @UseGuards(JwtUserGuard)
    @Get('user/:email')
    async findUserByEmail(@Param(':email') email: string, @Res() res: Response): Promise<Response> {
        try {
            const user = await this.usersService.findUserByEmail(email);
            if (!user) {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "User does not exist!", null)
            } else {
                return successResponse(res, HttpStatus.OK, "user retrieved successful", user)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }

    }

    //get user by id
    @UseGuards(JwtUserGuard)
    @Get(':id')
    @UseGuards(JwtUserGuard)
    async findOne(@Param(':id') id: number, @Res() res: Response): Promise<Response> {
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "User does not exist!", null)
            } else {
                return successResponse(res, HttpStatus.OK, "user retrieved successful", user)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }
    }

    //create user
    @Post("/signup")
    async create(@Body() user: User, @Res() res: Response): Promise<Response> {
        try {
            const foundUser = await this.usersService.findUserByEmail(user.email)
            if (!foundUser) {
                user.password = await hashPassword(user.password)
                const newUser = await this.usersService.create(user);
                return successResponse(res, HttpStatus.OK, "user created successful", newUser)
            } else {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "UUser with email already exists!", null)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }
    }

    //update user
    @UseGuards(JwtUserGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() user: User, @Res() res: Response): Promise<Response> {
        try {
            const updatedUser = await this.usersService.update(id, user)
            return successResponse(res, HttpStatus.OK, "user retrieved successful", updatedUser)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }
    }

    //delete user
    @UseGuards(JwtUserGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @Res() res : Response): Promise<Response> {
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                return errorResponse(res, HttpStatus.BAD_REQUEST, "User does not exist!", null)
            } else {
                await this.usersService.delete(id)
                return successResponse(res, HttpStatus.OK, "user deleted successful", null)
            }
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again.", error.message)
        }

    }
}
