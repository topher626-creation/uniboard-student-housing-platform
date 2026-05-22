import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { AppError } from '../middleware/errorHandler.js';
export class PaymentService {
    async createPayment(bookingId, studentId, data) {
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
    async getPayment(id) {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            throw new AppError(404, 'Payment not found');
        }
        return payment;
    }
    async uploadProof(id, proofUrl) {
        const payment = await this.getPayment(id);
        await payment.update({ proofUrl, status: 'completed' });
        return payment;
    }
    async updatePaymentStatus(id, status) {
        const payment = await this.getPayment(id);
        await payment.update({ status: status });
        return payment;
    }
}
export default new PaymentService();
//# sourceMappingURL=paymentService.js.map