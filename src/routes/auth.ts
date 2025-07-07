import { Router } from 'express';
import UsersController from "../controllers/users";
const router = Router();

router.post('/register', UsersController.registerUser);
router.post('/login', UsersController.loginUser);

export default router;