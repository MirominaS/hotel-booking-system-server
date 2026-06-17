import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"
import roomRoutes from "./routes/roomRoutes.js"
import roomTypeRoutes from "./routes/roomTypeRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import mediaRoutes from "./routes/mediaRoutes.js"

const app = express();
app.use(cors());

app.use(express.json());

//auth
app.use("/api/auth", authRoutes);

//hotel-owner
app.use("/api/hotel-owner", hotelRoutes);

//hotel-room
app.use("/api/rooms", roomRoutes)
app.use("/api/room-types", roomTypeRoutes)

app.use("/api/booking", bookingRoutes)

//admin
app.use("/api/admin", adminRoutes);

//customer
app.use("/api/customer", customerRoutes)

//payment
app.use("/api/payments", paymentRoutes)

//media
app.use("/api/media", mediaRoutes)

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
