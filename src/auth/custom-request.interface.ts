import { Request } from 'express';
import { User } from '../users/dto/user.entity';
import { Admin } from '../admin/dto/admin.entity';

export interface CustomRequest extends Request {
    user?: User | Admin;
}
