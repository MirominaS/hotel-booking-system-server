import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadMedia,
  getMediaAccessUrl,
  deleteMedia,
  updateMedia,
  grantEditAccess,
  getMyMedia,
  getPublicMedia,
} from "../controllers/mediaController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/upload", protect,authorize("hotel_owner"), upload.single("file"), uploadMedia);
router.get("/:id/url", optionalAuth, getMediaAccessUrl);
router.get("/", protect, getMyMedia)
router.get("/public", getPublicMedia)
router.patch("/:id", protect, authorize("hotel_owner"),  upload.single("file"), updateMedia)
router.patch("/:id/grant-edit", protect,authorize("admin"), grantEditAccess )
router.delete("/:id", protect, authorize("hotel_owner"), deleteMedia);


export default router;
