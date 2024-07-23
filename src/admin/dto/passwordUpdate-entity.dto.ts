import { Entity } from "typeorm";


@Entity()
export class UpdatePasswordDto {
    readonly password: string
}