import { Router } from 'express';
import { listFeedback, createFeedback, deleteFeedback } from '../controllers/feedbackController';
import { authenticate } from '../middlewares/auth';
const router = Router();
router.get('/:id/feedback', listFeedback);
router.post('/:id/feedback', authenticate, createFeedback);
router.delete('/feedback/:id', authenticate, deleteFeedback);
export default router;