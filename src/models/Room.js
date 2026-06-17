import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      trim: true,
    },

    roomNumber: {
      type: Number,
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],

    mode: {
      type: String,
      enum: ["online", "in-person"],
      default: "online",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
