import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  getAllHotels,
  getHotelById,
  approveHotel,
  rejectHotel,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.put("/hotels/:id/approve", approveHotel);
router.put("/hotels/:id/reject", rejectHotel);

export default router;
