import { Router } from 'express';
const router = Router();
import ProgressController from "../controllers/progress"

router.get('/:id', ProgressController.getProgressData)

export default router;