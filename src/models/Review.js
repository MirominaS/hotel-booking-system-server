import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    reviewableId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reviewableType",
    },

    reviewableType: {
      type: String,
      enum: ["Hotel", "RoomType", "HotelOwner"],
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
    },

    comment: {
      type: String,
      trim: true,
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

reviewSchema.index(
  {
    customer: 1,
    reviewableType: 1,
    reviewableId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isActive: true,
    },
  },
);

export default mongoose.model("Review", reviewSchema);
