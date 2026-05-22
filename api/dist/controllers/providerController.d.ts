import { Request, Response, NextFunction } from 'express';
export declare class ProviderController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    getApproved(_req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: ProviderController;
export default _default;
//# sourceMappingURL=providerController.d.ts.map