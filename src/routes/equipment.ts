import { Router } from 'express';
import EquipmentController from "../controllers/equipment";
const router = Router();

router.post('/', EquipmentController.addEquipment);


export default router;