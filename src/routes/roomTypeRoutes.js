import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

import {
  createRoomType,
  getHotelRoomTypes,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType,
} from "../controllers/roomTypeController.js";

const router = express.Router();

router.post("/:hotelId", protect, authorize("hotel_owner"), createRoomType);
router.get("/hotel/:hotelId", protect, authorize("hotel_owner"), getHotelRoomTypes,);
router.get("/:id", protect, authorize("hotel_owner"), getRoomTypeById);
router.put("/:id", protect, authorize("hotel_owner"), updateRoomType);
router.delete("/:id", protect, authorize("hotel_owner"), deleteRoomType);

export default router;
