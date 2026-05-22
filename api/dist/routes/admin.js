import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const router = Router();
router.patch('/providers/:providerId/approve', authMiddleware, requireRole('admin'), adminController.approveProvider.bind(adminController));
router.patch('/providers/:providerId/disable', authMiddleware, requireRole('admin'), adminController.disableProvider.bind(adminController));
router.patch('/properties/:propertyId/approve', authMiddleware, requireRole('admin'), adminController.approveProperty.bind(adminController));
router.patch('/users/:userId/block', authMiddleware, requireRole('admin'), adminController.blockUser.bind(adminController));
router.get('/providers/pending', authMiddleware, requireRole('admin'), adminController.getPendingProviders.bind(adminController));
router.get('/properties/pending', authMiddleware, requireRole('admin'), adminController.getPendingProperties.bind(adminController));
router.get('/reports', authMiddleware, requireRole('admin'), adminController.getOpenReports.bind(adminController));
router.patch('/reports/:reportId/resolve', authMiddleware, requireRole('admin'), adminController.resolveReport.bind(adminController));
export default router;
//# sourceMappingURL=admin.js.map