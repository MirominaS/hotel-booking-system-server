import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },

  description: {
    type: String,
    trim: true,
  },

  amenities: [
    {
      type: String,
    },
  ],

  capacity: {
    type: Number,
    required: true,
    min: 1,
  },

  pricePerNight: {
    type: Number,
    required: true,
    min: 0,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
},
{
    timestamps: true,
});

const RoomType =  mongoose.model("RoomType", roomTypeSchema);

export default RoomType;
