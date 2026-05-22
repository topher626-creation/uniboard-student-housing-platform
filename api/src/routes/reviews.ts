import { Router } from 'express';
import reviewController from '../controllers/reviewController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/:bookingId/:propertyId', authMiddleware, requireRole('student'), reviewController.create.bind(reviewController));
router.get('/property/:propertyId', reviewController.getByProperty.bind(reviewController));
router.put('/:id', authMiddleware, requireRole('student'), reviewController.update.bind(reviewController));
router.delete('/:id', authMiddleware, requireRole('student'), reviewController.delete.bind(reviewController));

export default router;
