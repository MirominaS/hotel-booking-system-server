import express from "express";
import {
  getAdminBookingStatus,
  getAdminOverview,
  getAdminRevenue,
} from "../controllers/adminAnalyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/overview", protect, authorize("admin"), getAdminOverview);
router.get("/revenue", protect, authorize("admin"), getAdminRevenue);
router.get(
  "/booking-status",
  protect,
  authorize("admin"),
  getAdminBookingStatus,
);

export default router;
