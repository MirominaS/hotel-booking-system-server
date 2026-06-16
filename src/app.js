import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"
import roomRoutes from "./routes/roomRoutes.js"
import roomTypeRoutes from "./routes/roomTypeRoutes.js"

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

//admin
app.use("/api/admin", adminRoutes);

//customer
app.use("/api/customer", customerRoutes)

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
