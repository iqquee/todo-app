import { Admin } from '../admin/dto/admin.entity';
import { User } from '../users/dto/user.entity';
import * as bcrypt from 'bcrypt';

// hashPassword hashes a users password on signup for security
export async function hashPassword( password: string ): Promise<string> {
    return await bcrypt.hash(password, 10);
}

// // hashAdminPassword hashes an admin password on signup for security
// export async function hashAdminPassword( password: string ): Promise<Partial<Admin>> {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     return { password: hashedPassword };
// }


// comparePasswords compares incoming password against the password saved in the database 
export async function comparePasswords(providedPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(providedPassword, hashedPassword);
}