import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  createHotel,
  getMyHotels,
  getMyHotelById,
  updateHotel,
  deleteHotel,
  getPublicHotelById,
} from "../controllers/hotelController.js";

const router = express.Router();

router.post("/", protect, createHotel);
router.get("/", protect, getMyHotels);
router.get("/:id", protect, authorize("hotel_owner"), getMyHotelById);
router.get("/public/:id", getPublicHotelById);
router.put("/:id", protect, authorize("hotel_owner"), updateHotel);
router.delete("/:id", protect, authorize("hotel_owner"), deleteHotel);

export default router;
