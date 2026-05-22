import { Router } from 'express';
import propertyController from '../controllers/propertyController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const router = Router();
router.post('/', authMiddleware, requireRole('provider'), propertyController.create.bind(propertyController));
router.get('/', propertyController.getAll.bind(propertyController));
router.get('/:id', propertyController.getById.bind(propertyController));
router.put('/:id', authMiddleware, requireRole('provider'), propertyController.update.bind(propertyController));
router.delete('/:id', authMiddleware, requireRole('provider'), propertyController.delete.bind(propertyController));
export default router;
//# sourceMappingURL=properties.js.map