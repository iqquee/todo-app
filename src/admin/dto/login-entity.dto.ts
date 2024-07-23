import { Entity } from "typeorm";


@Entity()
export class LoginDto {
    readonly email: string
    readonly password: string
}