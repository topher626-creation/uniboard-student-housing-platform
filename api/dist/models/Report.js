import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
export class Report extends Model {
}
Report.init({
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
}, {
    sequelize,
    tableName: 'reports',
    timestamps: true,
});
export default Report;
//# sourceMappingURL=Report.js.map