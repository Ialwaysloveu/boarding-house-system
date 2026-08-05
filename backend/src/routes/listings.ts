import { Router } from 'express';
import { getListings, getListingById, createListing } from '../controllers/listingController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/', authenticate, authorizeAdmin, createListing);

export default router;
