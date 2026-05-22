import { Router } from 'express';
import bookingController from '../controllers/bookingController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/:propertyId', authMiddleware, requireRole('student'), bookingController.create.bind(bookingController));
router.get('/:id', authMiddleware, bookingController.getById.bind(bookingController));
router.get('/my/bookings', authMiddleware, requireRole('student'), bookingController.getMyBookings.bind(bookingController));
router.get('/provider/bookings', authMiddleware, requireRole('provider'), bookingController.getProviderBookings.bind(bookingController));
router.patch('/:id/confirm', authMiddleware, requireRole('provider'), bookingController.confirm.bind(bookingController));
router.patch('/:id/reject', authMiddleware, requireRole('provider'), bookingController.reject.bind(bookingController));
router.patch('/:id/complete', authMiddleware, requireRole('provider'), bookingController.complete.bind(bookingController));

export default router;
