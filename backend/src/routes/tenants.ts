import { Router } from 'express';
import { getTenants } from '../controllers/tenantController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';
const router = Router();
router.get('/', authenticate, authorizeAdmin, getTenants);
export default router;