import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { AppError } from '../middleware/errorHandler.js';

export class PaymentService {
  async createPayment(bookingId: string, studentId: string, data: any) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }

    const payment = await Payment.create({
      bookingId,
      studentId,
      amount: booking.totalPrice,
      ...data,
    });

    return payment;
  }

  async getPayment(id: string) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }
    return payment;
  }

  async uploadProof(id: string, proofUrl: string) {
    const payment = await this.getPayment(id);
    await payment.update({ proofUrl, status: 'completed' as any });
    return payment;
  }

  async updatePaymentStatus(id: string, status: string) {
    const payment = await this.getPayment(id);
    await payment.update({ status: status as any });
    return payment;
  }
}

export default new PaymentService();
