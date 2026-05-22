import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Favorite extends Model {
}
Favorite.init({
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
}, {
    sequelize,
    tableName: 'favorites',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['studentId', 'propertyId'],
        },
    ],
});
export default Favorite;
//# sourceMappingURL=Favorite.js.map