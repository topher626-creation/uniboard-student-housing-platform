import Provider from '../models/Provider.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
export class ProviderService {
    async createProvider(userId, data) {
        const existingProvider = await Provider.findOne({ where: { userId } });
        if (existingProvider) {
            throw new AppError(400, 'Provider profile already exists');
        }
        const provider = await Provider.create({
            userId,
            ...data,
        });
        return provider;
    }
    async getProviderById(id) {
        const provider = await Provider.findByPk(id);
        if (!provider) {
            throw new AppError(404, 'Provider not found');
        }
        return provider;
    }
    async getProviderByUserId(userId) {
        const provider = await Provider.findOne({ where: { userId } });
        if (!provider) {
            throw new AppError(404, 'Provider not found');
        }
        return provider;
    }
    async updateProvider(id, userId, data) {
        const provider = await this.getProviderById(id);
        const user = await User.findByPk(userId);
        if (!user || user.id !== provider.userId) {
            throw new AppError(403, 'Forbidden');
        }
        await provider.update(data);
        return provider;
    }
    async getApprovedProviders() {
        return Provider.findAll({
            where: { isApproved: true },
            order: [['createdAt', 'DESC']],
        });
    }
}
export default new ProviderService();
//# sourceMappingURL=providerService.js.map