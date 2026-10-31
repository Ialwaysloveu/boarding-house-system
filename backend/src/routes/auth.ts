import rateLimit from 'express-rate-limit';
import { Router } from 'express';
import { register, login, logout, refresh } from '../controllers/authController';
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;


