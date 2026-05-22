import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, phone, role } = req.body;

      if (!email || !password || !fullName) {
        throw new AppError(400, 'Missing required fields');
      }

      const result = await authService.register(email, password, fullName, phone, role);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, 'Email and password required');
      }

      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Unauthorized');
      }

      const user = await authService.getUser(req.userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
