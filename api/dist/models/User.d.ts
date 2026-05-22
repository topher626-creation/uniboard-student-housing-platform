import { Model, Optional } from 'sequelize';
interface UserAttributes {
    id: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    profileImage?: string;
    role: 'student' | 'provider' | 'admin';
    isVerified: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    profileImage?: string;
    role: 'student' | 'provider' | 'admin';
    isVerified: boolean;
    isBlocked: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map