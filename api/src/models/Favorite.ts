import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface FavoriteAttributes {
  id: string;
  studentId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  declare id: string;
  declare studentId: string;
  declare propertyId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    propertyId: {
      type: DataTypes.UUID,
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
    tableName: 'favorites',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'propertyId'],
      },
    ],
  }
);

export default Favorite;
