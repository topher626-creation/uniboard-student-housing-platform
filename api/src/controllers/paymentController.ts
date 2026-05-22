import { Request, Response, NextFunction } from 'express';
import paymentService from '../services/paymentService.js';
import { AppError } from '../middleware/errorHandler.js';

export class PaymentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const payment = await paymentService.createPayment(req.params.bookingId, req.userId, req.body);
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getPayment(req.params.id);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async uploadProof(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const { proofUrl } = req.body;
      const payment = await paymentService.uploadProof(req.params.id, proofUrl);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
