import { Router } from 'express';
import favoriteController from '../controllers/favoriteController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const router = Router();
router.post('/:propertyId', authMiddleware, requireRole('student'), favoriteController.add.bind(favoriteController));
router.delete('/:propertyId', authMiddleware, requireRole('student'), favoriteController.remove.bind(favoriteController));
router.get('/', authMiddleware, requireRole('student'), favoriteController.getAll.bind(favoriteController));
export default router;
//# sourceMappingURL=favorites.js.map