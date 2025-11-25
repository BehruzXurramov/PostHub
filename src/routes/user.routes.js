import { Router } from 'express';
import { activateUser, addUser } from '../controllers/user.controller.js';
const router = Router()

router.post('/', addUser)
router.get('/activate/:linktoken', activateUser)

export default router;