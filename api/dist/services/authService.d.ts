export declare class AuthService {
    register(email: string, password: string, fullName: string, phone: string, role?: 'student' | 'provider'): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            phone?: string;
            profileImage?: string;
            role: "student" | "provider" | "admin";
            isVerified: boolean;
            isBlocked: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            phone?: string;
            profileImage?: string;
            role: "student" | "provider" | "admin";
            isVerified: boolean;
            isBlocked: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getUser(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone?: string;
        profileImage?: string;
        role: "student" | "provider" | "admin";
        isVerified: boolean;
        isBlocked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private sanitizeUser;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=authService.d.ts.map