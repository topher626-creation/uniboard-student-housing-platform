import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Provider extends Model {
}
Provider.init({
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
}, {
    sequelize,
    tableName: 'providers',
    timestamps: true,
});
export default Provider;
//# sourceMappingURL=Provider.js.map