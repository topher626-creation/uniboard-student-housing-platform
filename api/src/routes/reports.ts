import { Router } from 'express';
import reportController from '../controllers/reportController.js';

const router = Router();

router.post('/', reportController.create.bind(reportController));

export default router;
