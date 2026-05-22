import { Router } from 'express';
import providerController from '../controllers/providerController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, requireRole('provider'), providerController.create.bind(providerController));
router.get('/my-profile', authMiddleware, requireRole('provider'), providerController.getMyProfile.bind(providerController));
router.get('/approved', providerController.getApproved.bind(providerController));
router.get('/:id', providerController.getById.bind(providerController));
router.put('/:id', authMiddleware, requireRole('provider'), providerController.update.bind(providerController));

export default router;
