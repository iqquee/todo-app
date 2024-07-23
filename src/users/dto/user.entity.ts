import { Entity, PrimaryGeneratedColumn, Column, } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ default: 'user' })
    role: string;

    @Column()
    dob: string

    @Column({default: null})
    phone_number: number

    @Column()
    password: string;
}
