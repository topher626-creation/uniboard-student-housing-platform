import User from '../models/User.js';
import { hashPassword, generateToken, comparePassword } from '../utils/auth.js';
import { AppError } from '../middleware/errorHandler.js';
export class AuthService {
    async register(email, password, fullName, phone, role = 'student') {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError(400, 'Email already registered');
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            email,
            password: hashedPassword,
            fullName,
            phone,
            role,
            isVerified: false,
            isBlocked: false,
        });
        const token = generateToken(user.id, user.role);
        return { user: this.sanitizeUser(user), token };
    }
    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new AppError(401, 'Invalid email or password');
        }
        if (user.isBlocked) {
            throw new AppError(403, 'Account has been blocked');
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid email or password');
        }
        const token = generateToken(user.id, user.role);
        return { user: this.sanitizeUser(user), token };
    }
    async getUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError(404, 'User not found');
        }
        return this.sanitizeUser(user);
    }
    sanitizeUser(user) {
        const { password, ...data } = user.toJSON();
        return data;
    }
}
export default new AuthService();
//# sourceMappingURL=authService.js.map