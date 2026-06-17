import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["image", "document"],
      required: true,
    },

    folder: {
      type: String,
      required: true,
      enum: ["hotel-images", "room-images", "hotel-licenses", "owner-nic"],
    },

    visibility: {
      type: String,
      enum: ["public", "admin-use"],
      default: "admin-use",
    },

    editable: {
      type: Boolean,
      default: true,
    },

    editGrantedByAdmin: {
      type: Boolean,
      default: false,
    },

    editGrantedAt: Date,

    editGrantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    editExpiresAt: Date,
  },
  {
    timestamps: true,
  },
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
