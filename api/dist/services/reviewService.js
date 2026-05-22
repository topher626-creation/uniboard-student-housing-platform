import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import { AppError } from '../middleware/errorHandler.js';
export class ReviewService {
    async createReview(bookingId, studentId, propertyId, data) {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new AppError(404, 'Booking not found');
        }
        if (booking.studentId !== studentId) {
            throw new AppError(403, 'Forbidden');
        }
        const review = await Review.create({
            bookingId,
            studentId,
            propertyId,
            ...data,
        });
        return review;
    }
    async getReviewsByProperty(propertyId) {
        return Review.findAll({
            where: { propertyId },
            order: [['createdAt', 'DESC']],
        });
    }
    async updateReview(id, studentId, data) {
        const review = await Review.findByPk(id);
        if (!review) {
            throw new AppError(404, 'Review not found');
        }
        if (review.studentId !== studentId) {
            throw new AppError(403, 'Forbidden');
        }
        await review.update(data);
        return review;
    }
    async deleteReview(id, studentId) {
        const review = await Review.findByPk(id);
        if (!review) {
            throw new AppError(404, 'Review not found');
        }
        if (review.studentId !== studentId) {
            throw new AppError(403, 'Forbidden');
        }
        await review.destroy();
    }
}
export default new ReviewService();
//# sourceMappingURL=reviewService.js.map