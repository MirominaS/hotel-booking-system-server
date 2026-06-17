import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBookingCheckout, paymentSuccess } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/checkout", protect, createBookingCheckout);
router.post("/success", protect, paymentSuccess);
export default router;
