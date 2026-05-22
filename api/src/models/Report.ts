import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface ReportAttributes {
  id: string;
  type: 'fake_listing' | 'scam' | 'misconduct' | 'suspicious_activity';
  listingUrl?: string;
  message: string;
  contactEmail?: string;
  isAnonymous: boolean;
  status: 'open' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

interface ReportCreationAttributes extends Optional<ReportAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

export class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  declare id: string;
  declare type: 'fake_listing' | 'scam' | 'misconduct' | 'suspicious_activity';
  declare listingUrl?: string;
  declare message: string;
  declare contactEmail?: string;
  declare isAnonymous: boolean;
  declare status: 'open' | 'resolved';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('fake_listing', 'scam', 'misconduct', 'suspicious_activity'),
      allowNull: false,
    },
    listingUrl: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contactEmail: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved'),
      defaultValue: 'open',
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
    tableName: 'reports',
    timestamps: true,
  }
);

export default Report;
