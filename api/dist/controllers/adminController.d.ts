import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    approveProvider(req: Request, res: Response, next: NextFunction): Promise<void>;
    approveProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    disableProvider(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPendingProviders(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getPendingProperties(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getOpenReports(_req: Request, res: Response, next: NextFunction): Promise<void>;
    resolveReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: AdminController;
export default _default;
//# sourceMappingURL=adminController.d.ts.map