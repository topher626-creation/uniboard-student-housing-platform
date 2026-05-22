import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Payment extends Model {
}
Payment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    bookingId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'ZMW',
    },
    paymentMethod: {
        type: DataTypes.ENUM('stripe', 'mtn', 'airtel', 'proof'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
    },
    transactionId: {
        type: DataTypes.STRING,
    },
    proofUrl: {
        type: DataTypes.STRING,
    },
    stripePaymentIntentId: {
        type: DataTypes.STRING,
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
    tableName: 'payments',
    timestamps: true,
});
export default Payment;
//# sourceMappingURL=Payment.js.map