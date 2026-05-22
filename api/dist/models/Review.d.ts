import { Model, Optional } from 'sequelize';
interface ReviewAttributes {
    id: string;
    propertyId: string;
    bookingId: string;
    studentId: string;
    rating: number;
    comment: string;
    cleanliness: number;
    communication: number;
    accuracy: number;
    createdAt: Date;
    updatedAt: Date;
}
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    id: string;
    propertyId: string;
    bookingId: string;
    studentId: string;
    rating: number;
    comment: string;
    cleanliness: number;
    communication: number;
    accuracy: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Review;
//# sourceMappingURL=Review.d.ts.map