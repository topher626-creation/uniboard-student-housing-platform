import { Router } from 'express';
import paymentController from '../controllers/paymentController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/:bookingId', authMiddleware, requireRole('student'), paymentController.create.bind(paymentController));
router.get('/:id', authMiddleware, paymentController.getById.bind(paymentController));
router.post('/:id/upload-proof', authMiddleware, requireRole('student'), paymentController.uploadProof.bind(paymentController));

export default router;
