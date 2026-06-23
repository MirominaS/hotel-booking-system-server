import express from "express";
import {
  createReview,
  deleteReview,
  getHotelReviews,
  getHotelReviewSummary,
  getOwnerReviews,
  getRoomTypeReviews,
  updateReview,
  getAllReviews,
  canReview,
  getMyHotelReviews,
  getMyOwnerReviews,
  getMyRoomReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createReview);
router.get("/room-type/:roomTypeId", getRoomTypeReviews);
router.get("/hotel_owner/me", protect, authorize("hotel_owner"), getMyOwnerReviews);
router.get("/hotel_owner/:ownerId", getOwnerReviews);
router.get("/hotel/:hotelId", getHotelReviews);
router.get("/summary/hotel/:hotelId", getHotelReviewSummary);
router.get("/", protect, authorize("admin"), getAllReviews);
router.get("/can-review", protect, authorize("customer"), canReview);
router.patch("/:id", protect, authorize("customer"), updateReview);
router.delete("/:id", protect, deleteReview);
router.get("/hotels/me", protect, authorize("hotel_owner"), getMyHotelReviews);
router.get("/rooms/me", protect, authorize("hotel_owner"), getMyRoomReviews);
export default router;
