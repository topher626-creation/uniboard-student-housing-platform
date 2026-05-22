import { Model, Optional } from 'sequelize';
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
interface ProviderCreationAttributes extends Optional<ProviderAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Provider extends Model<ProviderAttributes, ProviderCreationAttributes> implements ProviderAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Provider;
//# sourceMappingURL=Provider.d.ts.map