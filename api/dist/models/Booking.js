import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Booking extends Model {
}
Booking.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    propertyId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    providerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    checkInDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    checkOutDate: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'rejected', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
    tableName: 'bookings',
    timestamps: true,
});
export default Booking;
//# sourceMappingURL=Booking.js.map