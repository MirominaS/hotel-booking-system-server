import Hotel from "../models/Hotel.js";

//get approved hotels
export const getApprovedHotelsService = async () => {
  return await Hotel.find({
    status: "approved",
    isActive: true,
  }).populate("user", "firstName lastName");
};

//get approved single hotel
export const getApprovedHotelByIdService = async (hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    status: "approved",
    isActive: true,
  }).populate("user", "firstName lastName");

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  return hotel;
};
