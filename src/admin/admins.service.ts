import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './dto/admin.entity';

@Injectable()
export class AdminsService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
    ) { }

    async getAdminByEmail(email: string): Promise<Admin> {
        return this.adminRepository.findOne({ where: { email } })
    };

    async createAdmin(admin: Partial<Admin>): Promise<Admin> {
        return this.adminRepository.save(admin)
    }

    async updateDetails(id: number, admin: Partial<Admin>): Promise<Admin> {
        await this.adminRepository.update(id, admin);
        return this.adminRepository.findOne({where: {id}});
    }
}