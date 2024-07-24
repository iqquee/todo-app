import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    // @Column()
    // role: string

    @Column({ nullable: true })
    phone_number: number

    @Column()
    password: string;
}
