import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface BookingAttributes {
  id: string;
  propertyId: string;
  studentId: string;
  providerId: string;
  checkInDate: Date;
  checkOutDate?: Date;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  declare id: string;
  declare propertyId: string;
  declare studentId: string;
  declare providerId: string;
  declare checkInDate: Date;
  declare checkOutDate?: Date;
  declare status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  declare totalPrice: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Booking.init(
  {
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
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
  }
);

export default Booking;
