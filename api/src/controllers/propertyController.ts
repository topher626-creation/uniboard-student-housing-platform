import { Request, Response, NextFunction } from 'express';
import propertyService from '../services/propertyService.js';
import { AppError } from '../middleware/errorHandler.js';

export class PropertyController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const property = await propertyService.createProperty(req.userId, req.body);
      res.status(201).json(property);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertyService.getPropertyById(req.params.id);
      res.status(200).json(property);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await propertyService.getProperties(req.query);
      res.status(200).json(properties);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const property = await propertyService.updateProperty(req.params.id, req.userId, req.body);
      res.status(200).json(property);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      await propertyService.deleteProperty(req.params.id, req.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new PropertyController();
