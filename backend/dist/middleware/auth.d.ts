import { Request, Response, NextFunction } from 'express';
type AuthRequest = Request & {
    user?: {
        id: string;
        role: import('@prisma/client').Role;
        status: import('@prisma/client').UserStatus;
        adminLevel?: import('@prisma/client').AdminLevel | null;
    };
};
declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const isAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isSuperAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isLandlord: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const isLandlordOrManager: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default authMiddleware;
//# sourceMappingURL=auth.d.ts.map