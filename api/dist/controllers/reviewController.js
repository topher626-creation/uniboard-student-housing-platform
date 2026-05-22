import reviewService from '../services/reviewService.js';
import { AppError } from '../middleware/errorHandler.js';
export class ReviewController {
    async create(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            const review = await reviewService.createReview(req.params.bookingId, req.userId, req.params.propertyId, req.body);
            res.status(201).json(review);
        }
        catch (error) {
            next(error);
        }
    }
    async getByProperty(req, res, next) {
        try {
            const reviews = await reviewService.getReviewsByProperty(req.params.propertyId);
            res.status(200).json(reviews);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            const review = await reviewService.updateReview(req.params.id, req.userId, req.body);
            res.status(200).json(review);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            await reviewService.deleteReview(req.params.id, req.userId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
export default new ReviewController();
//# sourceMappingURL=reviewController.js.map