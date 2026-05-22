import { Model, Optional } from 'sequelize';
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
interface PropertyCreationAttributes extends Optional<PropertyAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Property extends Model<PropertyAttributes, PropertyCreationAttributes> implements PropertyAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Property;
//# sourceMappingURL=Property.d.ts.map