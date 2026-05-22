import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Property from '../models/Property.js';
export declare class AdminService {
    approveProvider(providerId: string): Promise<Provider>;
    approveProperty(propertyId: string): Promise<Property>;
    blockUser(userId: string): Promise<User>;
    disableProvider(providerId: string): Promise<Provider>;
    getPendingProviders(): Promise<Provider[]>;
    getPendingProperties(): Promise<Property[]>;
    getOpenReports(): Promise<import("../models/Report.js").Report[]>;
    resolveReport(reportId: string): Promise<import("../models/Report.js").Report>;
}
declare const _default: AdminService;
export default _default;
//# sourceMappingURL=adminService.d.ts.map