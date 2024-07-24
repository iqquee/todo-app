import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { TodosService } from './todos.service';
import { Todo } from './dto/todo.entity';
import { errorResponse, successResponse } from "../utils/response"


@Controller('todo')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Post("")
    async createTodo(@Body() request: Todo, @Res() res: Response): Promise<Response> {
        try {
            const todo = await this.todosService.createTodo(request)
            return successResponse(res, HttpStatus.CREATED, "todo created successfully", todo)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while creating todo", error.message)
        }
    }

    @Get("/:id")
    async getTodoByID(@Param(":id") id: number, @Res() res: Response): Promise<Response> {
        try {
            const todo = this.todosService.getTodoByID(id)
            return successResponse(res, HttpStatus.CREATED, "todo retrieved successfully", todo)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieved todo", error.message)
        }
    }

    @Get("/completed/:isCompleted")
    async getCompletedTodos(@Param(":isCompleted") completed: string, @Res() res: Response): Promise<Response> {
        try {
            let isCompleted = false
            if (completed === "true") {
                isCompleted = true
            }

            const todos = this.todosService.getTodoByFilter(isCompleted)
            return successResponse(res, HttpStatus.CREATED, "todos retrieved successfully", todos)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieved todo", error.message)
        }
    }

    @Get("/todos")
    async getAllTodos(@Res() res: Response): Promise<Response> {
        try {
            const todos = this.todosService.getAllTodos()
            return successResponse(res, HttpStatus.CREATED, "todos retrieved successfully", todos)
        } catch (error) {
            return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieved todo", error.message)
        }
    }

}