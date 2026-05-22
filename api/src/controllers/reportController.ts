import { Request, Response, NextFunction } from 'express';
import reportService from '../services/reportService.js';

export class ReportController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.createReport(req.body);
      res.status(201).json(report);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
