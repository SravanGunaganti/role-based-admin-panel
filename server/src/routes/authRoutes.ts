import express from 'express';
import { registerUser, loginUser, verifyAuth } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/register',protect, authorizeRoles('admin'), registerUser);
router.post('/login', loginUser);
router.get('/verify', protect,verifyAuth);

export default router;