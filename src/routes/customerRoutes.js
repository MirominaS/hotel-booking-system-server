import express from "express";
import { getApprovedHotels,getApprovedHotelById } from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getApprovedHotels);
router.get("/:id", getApprovedHotelById);

export default router;