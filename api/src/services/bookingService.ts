import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { AppError } from '../middleware/errorHandler.js';

export class BookingService {
  async createBooking(propertyId: string, studentId: string, data: any) {
    const property = await Property.findByPk(propertyId);
    if (!property) {
      throw new AppError(404, 'Property not found');
    }

    if (property.occupiedRooms >= property.totalRooms) {
      throw new AppError(400, 'No rooms available');
    }

    const booking = await Booking.create({
      propertyId,
      studentId,
      providerId: property.providerId,
      ...data,
    });

    return booking;
  }

  async getBooking(id: string) {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }
    return booking;
  }

  async getBookingsByStudent(studentId: string) {
    return Booking.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
    });
  }

  async getBookingsByProvider(providerId: string) {
    return Booking.findAll({
      where: { providerId },
      order: [['createdAt', 'DESC']],
    });
  }

  async confirmBooking(id: string, providerId: string) {
    const booking = await this.getBooking(id);
    if (booking.providerId !== providerId) {
      throw new AppError(403, 'Forbidden');
    }

    await booking.update({ status: 'confirmed' });
    const property = await Property.findByPk(booking.propertyId);
    if (property) {
      await property.increment('occupiedRooms');
    }

    return booking;
  }

  async rejectBooking(id: string, providerId: string) {
    const booking = await this.getBooking(id);
    if (booking.providerId !== providerId) {
      throw new AppError(403, 'Forbidden');
    }

    await booking.update({ status: 'rejected' });
    return booking;
  }

  async completeBooking(id: string, providerId: string) {
    const booking = await this.getBooking(id);
    if (booking.providerId !== providerId) {
      throw new AppError(403, 'Forbidden');
    }

    await booking.update({ status: 'completed', checkOutDate: new Date() });
    return booking;
  }
}

export default new BookingService();
