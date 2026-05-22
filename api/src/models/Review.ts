import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

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

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  declare id: string;
  declare propertyId: string;
  declare bookingId: string;
  declare studentId: string;
  declare rating: number;
  declare comment: string;
  declare cleanliness: number;
  declare communication: number;
  declare accuracy: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Review.init(
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
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: true,
  }
);

export default Review;
