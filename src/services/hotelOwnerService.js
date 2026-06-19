import HotelOwner from "../models/HotelOwner.js";

export const createHotelOwnerService = async (
  userId,
  ownerNicNumber,
  ownerNicFront,
  ownerNicBack,
) => {
  return await HotelOwner.create({
    user: userId,
    ownerNicNumber,
    documents: {
      ownerNicFront,
      ownerNicBack,
    },
  });
};
