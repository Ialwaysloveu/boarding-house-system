import { Router } from 'express';
import { getRoomsByListing, createRoom, updateRoom, deleteRoom } from '../controllers/roomController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/listings/:listingId/rooms', getRoomsByListing);
router.post('/listings/:listingId/rooms', authenticate, authorizeAdmin, createRoom);
router.put('/rooms/:id', authenticate, authorizeAdmin, updateRoom);
router.delete('/rooms/:id', authenticate, authorizeAdmin, deleteRoom);

export default router;
