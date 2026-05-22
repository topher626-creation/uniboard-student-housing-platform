import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface ProviderAttributes {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  verificationDocuments?: string;
  approvalStatus: 'pending' | 'active' | 'rejected';
  isApproved: boolean;
  approvedAt?: Date;
  totalListings: number;
  totalBookings: number;
  avgRating: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProviderCreationAttributes extends Optional<ProviderAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Provider extends Model<ProviderAttributes, ProviderCreationAttributes> implements ProviderAttributes {
  declare id: string;
  declare userId: string;
  declare businessName: string;
  declare businessEmail: string;
  declare businessPhone: string;
  declare verificationDocuments?: string;
  declare approvalStatus: 'pending' | 'active' | 'rejected';
  declare isApproved: boolean;
  declare approvedAt?: Date;
  declare totalListings: number;
  declare totalBookings: number;
  declare avgRating: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Provider.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    businessPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationDocuments: {
      type: DataTypes.JSON,
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'active', 'rejected'),
      defaultValue: 'pending',
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approvedAt: {
      type: DataTypes.DATE,
    },
    totalListings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalBookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    avgRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
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
    tableName: 'providers',
    timestamps: true,
  }
);

export default Provider;
