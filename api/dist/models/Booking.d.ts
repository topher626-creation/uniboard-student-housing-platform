import { Model, Optional } from 'sequelize';
interface BookingAttributes {
    id: string;
    propertyId: string;
    studentId: string;
    providerId: string;
    checkInDate: Date;
    checkOutDate?: Date;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    id: string;
    propertyId: string;
    studentId: string;
    providerId: string;
    checkInDate: Date;
    checkOutDate?: Date;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
    totalPrice: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Booking;
//# sourceMappingURL=Booking.d.ts.map