import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Review extends Model {
}
Review.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    propertyId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
    comment: {
        type: DataTypes.TEXT,
    },
    cleanliness: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
    },
    communication: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
    },
    accuracy: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'reviews',
    timestamps: true,
});
export default Review;
//# sourceMappingURL=Review.js.map