import { Request, Response, NextFunction } from 'express';
export declare class ReviewController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getByProperty(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: ReviewController;
export default _default;
//# sourceMappingURL=reviewController.d.ts.map