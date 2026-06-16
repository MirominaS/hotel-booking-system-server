import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  createRoom,
  getHotelRooms,
  getRoomById,
} from "../controllers/roomController.js";

const router = express.Router();

router.post("/:hotelId", protect, authorize("hotel_owner"), createRoom);
router.get("/hotel/:hotelId", protect, authorize("hotel_owner"), getHotelRooms);
router.get("/:id", protect, authorize("hotel_owner"), getRoomById);

export default router;
