import { Request, Response, NextFunction } from 'express';
export declare class PaymentController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadProof(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: PaymentController;
export default _default;
//# sourceMappingURL=paymentController.d.ts.map