import { Router } from 'express';
import { createPayment, getPayments } from '../controllers/paymentController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, authorizeAdmin, createPayment);
router.get('/', authenticate, getPayments);

export default router;


