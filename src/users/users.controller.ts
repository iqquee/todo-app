import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './dto/user.entity';
import {hashPassword} from "../utils/password"

@Controller('auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    //get all users
    @Get("/user/users")
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    //get user by email
    @Get('user/:email')
    async findUserByEmail(@Param('email') email: string): Promise<User> {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException('User does not exist!');
        } else {
            return user;
        }
    }

    //get user by id
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException('User does not exist!');
        } else {
            return user;
        }
    }

    //create user
    @Post("/signup")
    async create(@Body() user: User): Promise<User> {
        const foundUser = await this.usersService.findUserByEmail(user.email)
        console.log("user details:", user)
        if (!foundUser) {
            user.password = await hashPassword(user.password)
            return this.usersService.create(user);
        } else {
            throw new NotFoundException('User with email already exists');
        }
    }

    //update user
    @Put(':id')
    async update(@Param('id') id: number, @Body() user: User): Promise<any> {
        return this.usersService.update(id, user);
    }

    //delete user
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<any> {
        //handle error if user does not exist
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException('User does not exist!');
        }
        return this.usersService.delete(id);
    }
}

