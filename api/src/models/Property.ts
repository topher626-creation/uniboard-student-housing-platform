import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface PropertyAttributes {
  id: string;
  providerId: string;
  title: string;
  description: string;
  nearestUniversity: string;
  location: string;
  latitude?: number;
  longitude?: number;
  pricePerMonth: number;
  bedType: 'shared' | 'private';
  genderPreference: 'male' | 'female' | 'any';
  availableFrom: Date;
  totalRooms: number;
  occupiedRooms: number;
  amenities: string[];
  images: string[];
  isApproved: boolean;
  approvedAt?: Date;
  isActive: boolean;
  views: number;
  avgRating: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PropertyCreationAttributes extends Optional<PropertyAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Property extends Model<PropertyAttributes, PropertyCreationAttributes> implements PropertyAttributes {
  declare id: string;
  declare providerId: string;
  declare title: string;
  declare description: string;
  declare nearestUniversity: string;
  declare location: string;
  declare latitude?: number;
  declare longitude?: number;
  declare pricePerMonth: number;
  declare bedType: 'shared' | 'private';
  declare genderPreference: 'male' | 'female' | 'any';
  declare availableFrom: Date;
  declare totalRooms: number;
  declare occupiedRooms: number;
  declare amenities: string[];
  declare images: string[];
  declare isApproved: boolean;
  declare approvedAt?: Date;
  declare isActive: boolean;
  declare views: number;
  declare avgRating: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Property.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    providerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nearestUniversity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
    },
    pricePerMonth: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    bedType: {
      type: DataTypes.ENUM('shared', 'private'),
      defaultValue: 'shared',
    },
    genderPreference: {
      type: DataTypes.ENUM('male', 'female', 'any'),
      defaultValue: 'any',
    },
    availableFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalRooms: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    occupiedRooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    amenities: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approvedAt: {
      type: DataTypes.DATE,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    views: {
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
    tableName: 'properties',
    timestamps: true,
  }
);

export default Property;
