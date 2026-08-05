import { Router } from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/', authenticate, getBookings);
router.put('/:id/status', authenticate, authorizeAdmin, updateBookingStatus);

export default router;
