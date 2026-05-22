import Review from '../models/Review.js';
export declare class ReviewService {
    createReview(bookingId: string, studentId: string, propertyId: string, data: any): Promise<Review>;
    getReviewsByProperty(propertyId: string): Promise<Review[]>;
    updateReview(id: string, studentId: string, data: any): Promise<Review>;
    deleteReview(id: string, studentId: string): Promise<void>;
}
declare const _default: ReviewService;
export default _default;
//# sourceMappingURL=reviewService.d.ts.map