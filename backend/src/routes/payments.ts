import { Router } from 'express';
import { createPayment, getPayments } from '../controllers/paymentController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createPayment);
router.get('/', authenticate, getPayments);

export default router;
