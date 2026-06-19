import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getHotelOverview,
  getMonthlyRevenue,
  getBookingStatus,
  getTopRoomTypes,
  getOwnerOverview,
  getOwnerMonthlyRevenue,
  getOwnerBookingStatus,
  getTopHotels,
} from "../controllers/hotelAnalyticsController.js";

const router = express.Router();

router.get(
  "/hotels/:hotelId/overview",
  protect,
  authorize("hotel_owner"),
  getHotelOverview,
);
router.get(
  "/hotels/:hotelId/montly-revenue",
  protect,
  authorize("hotel_owner"),
  getMonthlyRevenue,
);
router.get(
  "/hotels/:hotelId/booking-status",
  protect,
  authorize("hotel_owner"),
  getBookingStatus,
);
router.get(
  "/hotels/:hotelId/top-room-types",
  protect,
  authorize("hotel_owner"),
  getTopRoomTypes,
);

router.get("/overview", protect, authorize("hotel_owner"), getOwnerOverview);

router.get(
  "/monthly-revenue",
  protect,
  authorize("hotel_owner"),
  getOwnerMonthlyRevenue,
);

router.get(
  "/booking-status",
  protect,
  authorize("hotel_owner"),
  getOwnerBookingStatus,
);

router.get("/top-hotels", protect, authorize("hotel_owner"), getTopHotels);
export default router;
