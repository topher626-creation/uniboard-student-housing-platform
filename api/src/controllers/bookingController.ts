import { Request, Response, NextFunction } from 'express';
import bookingService from '../services/bookingService.js';
import { AppError } from '../middleware/errorHandler.js';

export class BookingController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const booking = await bookingService.createBooking(req.params.propertyId, req.userId, req.body);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.getBooking(req.params.id);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const bookings = await bookingService.getBookingsByStudent(req.userId);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async getProviderBookings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const bookings = await bookingService.getBookingsByProvider(req.userId);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const booking = await bookingService.confirmBooking(req.params.id, req.userId);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const booking = await bookingService.rejectBooking(req.params.id, req.userId);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError(401, 'Unauthorized');

      const booking = await bookingService.completeBooking(req.params.id, req.userId);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
