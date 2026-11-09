import { Router } from "express";
import { getListings, getListingById, createListing, updateListing, deleteListing } from "../controllers/listingController";
import { authenticate, authorizeAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", getListings);
router.get("/:id", getListingById);
router.post("/", authenticate, authorizeAdmin, createListing);
router.put("/:id", authenticate, authorizeAdmin, updateListing);
router.delete("/:id", authenticate, authorizeAdmin, deleteListing);

export default router;