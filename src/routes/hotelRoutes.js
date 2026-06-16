import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { createHotel, getMyHotels,getMyHotelById } from "../controllers/hotelController.js";

const router = express.Router();

router.post("/", protect, createHotel);
router.get("/", protect, getMyHotels);
router.get("/:id", protect, authorize("hotel_owner"), getMyHotelById);

export default router;
