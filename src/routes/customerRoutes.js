import express from "express";
import {
  getApprovedHotels,
  getApprovedHotelById,
  getAvailableRoomById,
  getAvailableHotelRooms
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getApprovedHotels);
router.get("/:id", getApprovedHotelById);
router.get("/hotels/:hotelId/rooms", getAvailableHotelRooms);

router.get("/rooms/:id", getAvailableRoomById);

export default router;
