import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Property from '../models/Property.js';
import reportService from './reportService.js';
import { AppError } from '../middleware/errorHandler.js';
export class AdminService {
    async approveProvider(providerId) {
        const provider = await Provider.findByPk(providerId);
        if (!provider) {
            throw new AppError(404, 'Provider not found');
        }
        await provider.update({ isApproved: true, approvalStatus: 'active', approvedAt: new Date() });
        return provider;
    }
    async approveProperty(propertyId) {
        const property = await Property.findByPk(propertyId);
        if (!property) {
            throw new AppError(404, 'Property not found');
        }
        await property.update({ isApproved: true, approvedAt: new Date() });
        return property;
    }
    async blockUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError(404, 'User not found');
        }
        await user.update({ isBlocked: true });
        return user;
    }
    async disableProvider(providerId) {
        const provider = await Provider.findByPk(providerId);
        if (!provider) {
            throw new AppError(404, 'Provider not found');
        }
        await provider.update({ isApproved: false, approvalStatus: 'rejected' });
        return provider;
    }
    async getPendingProviders() {
        return Provider.findAll({
            where: { approvalStatus: 'pending' },
            order: [['createdAt', 'ASC']],
        });
    }
    async getPendingProperties() {
        return Property.findAll({
            where: { isApproved: false },
            order: [['createdAt', 'ASC']],
        });
    }
    async getOpenReports() {
        return reportService.getOpenReports();
    }
    async resolveReport(reportId) {
        return reportService.resolveReport(reportId);
    }
}
export default new AdminService();
//# sourceMappingURL=adminService.js.map