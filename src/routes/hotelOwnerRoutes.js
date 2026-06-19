import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createHotelOwner } from "../controllers/hotelOwnerController.js";

const router = express.Router();

router.post("/", protect, createHotelOwner);

export default router;
