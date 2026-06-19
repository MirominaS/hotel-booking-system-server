import { createHotelOwnerService } from "../services/hotelOwnerService.js";

export const createHotelOwner = async (req, res) => {
  try {
    const { ownerNicNumber, ownerNicFront, ownerNicBack } = req.body;

    const hotelOwner = await createHotelOwnerService(
      req.user._id,
      ownerNicNumber,
      ownerNicFront,
      ownerNicBack,
    );

    res.status(201).json({
      success: true,
      hotelOwner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
