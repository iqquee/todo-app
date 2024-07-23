import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './dto/todo.entity';
import { asyncScheduler } from 'rxjs';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) { }

    async createTodo(todo: Todo): Promise<Todo> {
        return this.todoRepository.save(todo)
    }

    async getAllTodos(): Promise<Todo[]> {
        return this.todoRepository.find()
    }

    async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
        await this.todoRepository.update(id, todo)
        return this.todoRepository.findOne({ where: { id } })
    }

    async getTodoByID(id: number): Promise<Todo> {
        return this.todoRepository.findOne({ where: { id } })
    }

    async getTodoByFilter(isCompleted: boolean): Promise<Todo[]> {
        return this.todoRepository.find({where: {isCompleted}})
    }
}