import mongoose from "mongoose";

const hotelOwnerSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      ownerNicNumber: {
        type: String,
        required: true,
      },

      documents: {
        ownerNicFront: {
          type: String,
          required: true,
        },

        ownerNicBack: {
          type: String,
          required: true,
        },
      },

    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "HotelOwner",
  hotelOwnerSchema
);