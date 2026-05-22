import { Model, Optional } from 'sequelize';
interface PaymentAttributes {
    id: string;
    bookingId: string;
    studentId: string;
    amount: number;
    currency: string;
    paymentMethod: 'stripe' | 'mtn' | 'airtel' | 'proof';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    proofUrl?: string;
    stripePaymentIntentId?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    id: string;
    bookingId: string;
    studentId: string;
    amount: number;
    currency: string;
    paymentMethod: 'stripe' | 'mtn' | 'airtel' | 'proof';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    proofUrl?: string;
    stripePaymentIntentId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Payment;
//# sourceMappingURL=Payment.d.ts.map