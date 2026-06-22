import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import roomTypeRoutes from "./routes/roomTypeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import hotelOwnerRoutes from "./routes/hotelOwnerRoutes.js";
import hotelAnalyticsRoutes from "./routes/hotelAnalyticsRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"

const app = express();
app.use(cors());

app.use(express.json());

//auth
app.use("/api/auth", authRoutes);

//hotel-owner
app.use("/api/hotel", hotelRoutes);
app.use("/api/hotel-owner", hotelOwnerRoutes);

//hotel-room
app.use("/api/rooms", roomRoutes);
app.use("/api/room-types", roomTypeRoutes);

app.use("/api/booking", bookingRoutes);

//hotel-analytics
app.use("/api/hotel-analytics", hotelAnalyticsRoutes);

//admin
app.use("/api/admin", adminRoutes);
app.use("/api/admin-analytics", adminAnalyticsRoutes);

//customer
app.use("/api/customer", customerRoutes);

//payment
app.use("/api/payments", paymentRoutes);

//media
app.use("/api/media", mediaRoutes);

//review
app.use("/api/reviews", reviewRoutes)

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
