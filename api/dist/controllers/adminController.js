import adminService from '../services/adminService.js';
export class AdminController {
    async approveProvider(req, res, next) {
        try {
            const provider = await adminService.approveProvider(req.params.providerId);
            res.status(200).json(provider);
        }
        catch (error) {
            next(error);
        }
    }
    async approveProperty(req, res, next) {
        try {
            const property = await adminService.approveProperty(req.params.propertyId);
            res.status(200).json(property);
        }
        catch (error) {
            next(error);
        }
    }
    async blockUser(req, res, next) {
        try {
            const user = await adminService.blockUser(req.params.userId);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async disableProvider(req, res, next) {
        try {
            const provider = await adminService.disableProvider(req.params.providerId);
            res.status(200).json(provider);
        }
        catch (error) {
            next(error);
        }
    }
    async getPendingProviders(_req, res, next) {
        try {
            const providers = await adminService.getPendingProviders();
            res.status(200).json(providers);
        }
        catch (error) {
            next(error);
        }
    }
    async getPendingProperties(_req, res, next) {
        try {
            const properties = await adminService.getPendingProperties();
            res.status(200).json(properties);
        }
        catch (error) {
            next(error);
        }
    }
    async getOpenReports(_req, res, next) {
        try {
            const reports = await adminService.getOpenReports();
            res.status(200).json(reports);
        }
        catch (error) {
            next(error);
        }
    }
    async resolveReport(req, res, next) {
        try {
            const report = await adminService.resolveReport(req.params.reportId);
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    }
}
export default new AdminController();
//# sourceMappingURL=adminController.js.map