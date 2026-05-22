import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

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

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: string;
  declare bookingId: string;
  declare studentId: string;
  declare amount: number;
  declare currency: string;
  declare paymentMethod: 'stripe' | 'mtn' | 'airtel' | 'proof';
  declare status: 'pending' | 'completed' | 'failed' | 'refunded';
  declare transactionId?: string;
  declare proofUrl?: string;
  declare stripePaymentIntentId?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Payment.init(
  {
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
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
  }
);

export default Payment;
