import express from "express";
import {
  checkAvailability,
  createBooking,
  getMyBookings,
  getBookingGroup,
  cancelBooking,
  cancelBookingGroup,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/availability", protect, authorize("customer"), checkAvailability);
router.post("/", protect, authorize("customer"), createBooking);
router.get("/my", protect, authorize("customer"), getMyBookings);
router.get("/reference/:bookingReference", protect, authorize("customer"),  getBookingGroup,);
router.patch("/:id/cancel", protect, authorize("customer"), cancelBooking);
router.patch("/reference/:bookingReference/cancel", protect,  authorize("customer"), cancelBookingGroup,);

export default router;
