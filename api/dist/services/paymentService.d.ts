import Payment from '../models/Payment.js';
export declare class PaymentService {
    createPayment(bookingId: string, studentId: string, data: any): Promise<Payment>;
    getPayment(id: string): Promise<Payment>;
    uploadProof(id: string, proofUrl: string): Promise<Payment>;
    updatePaymentStatus(id: string, status: string): Promise<Payment>;
}
declare const _default: PaymentService;
export default _default;
//# sourceMappingURL=paymentService.d.ts.map