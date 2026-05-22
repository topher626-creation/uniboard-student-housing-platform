import Booking from '../models/Booking.js';
export declare class BookingService {
    createBooking(propertyId: string, studentId: string, data: any): Promise<Booking>;
    getBooking(id: string): Promise<Booking>;
    getBookingsByStudent(studentId: string): Promise<Booking[]>;
    getBookingsByProvider(providerId: string): Promise<Booking[]>;
    confirmBooking(id: string, providerId: string): Promise<Booking>;
    rejectBooking(id: string, providerId: string): Promise<Booking>;
    completeBooking(id: string, providerId: string): Promise<Booking>;
}
declare const _default: BookingService;
export default _default;
//# sourceMappingURL=bookingService.d.ts.map