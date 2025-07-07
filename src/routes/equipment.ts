import { Router } from 'express';
import EquipmentController from "../controllers/equipment";
const router = Router();

router.post('/', EquipmentController.addEquipment);
router.get('/:id', EquipmentController.getEquipmentById);
router.get('/', EquipmentController.getAllEquipments);


export default router;