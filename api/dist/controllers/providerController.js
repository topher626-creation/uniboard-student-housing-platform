import providerService from '../services/providerService.js';
import { AppError } from '../middleware/errorHandler.js';
export class ProviderController {
    async create(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            const provider = await providerService.createProvider(req.userId, req.body);
            res.status(201).json(provider);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const provider = await providerService.getProviderById(req.params.id);
            res.status(200).json(provider);
        }
        catch (error) {
            next(error);
        }
    }
    async getMyProfile(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            const provider = await providerService.getProviderByUserId(req.userId);
            res.status(200).json(provider);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            if (!req.userId)
                throw new AppError(401, 'Unauthorized');
            const provider = await providerService.updateProvider(req.params.id, req.userId, req.body);
            res.status(200).json(provider);
        }
        catch (error) {
            next(error);
        }
    }
    async getApproved(_req, res, next) {
        try {
            const providers = await providerService.getApprovedProviders();
            res.status(200).json(providers);
        }
        catch (error) {
            next(error);
        }
    }
}
export default new ProviderController();
//# sourceMappingURL=providerController.js.map