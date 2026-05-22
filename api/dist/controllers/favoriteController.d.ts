import { Request, Response, NextFunction } from 'express';
export declare class FavoriteController {
    add(req: Request, res: Response, next: NextFunction): Promise<void>;
    remove(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: FavoriteController;
export default _default;
//# sourceMappingURL=favoriteController.d.ts.map