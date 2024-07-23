import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/dto/user.entity';

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number
    
    @Column()
    title: string

    @Column()
    description: string;

    @Column()
    dueDate: Date;

    @Column()
    isCompleted: boolean;
}
