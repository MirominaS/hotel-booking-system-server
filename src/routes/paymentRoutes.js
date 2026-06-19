import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBookingCheckout,
  getOwnerPayments,
  paymentSuccess,
} from "../controllers/paymentController.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
console.log("Payment routes loaded");
router.post("/checkout", protect, createBookingCheckout);
router.post("/success", protect, paymentSuccess);
router.get("/hotel_owner", protect, authorize("hotel_owner"), getOwnerPayments);
export default router;
