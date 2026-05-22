import { Request, Response, NextFunction } from 'express';
export declare class BookingController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProviderBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    confirm(req: Request, res: Response, next: NextFunction): Promise<void>;
    reject(req: Request, res: Response, next: NextFunction): Promise<void>;
    complete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: BookingController;
export default _default;
//# sourceMappingURL=bookingController.d.ts.map