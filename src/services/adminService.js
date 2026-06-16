import Hotel from "../models/Hotel.js";

//get all hotels
export const getAllHotelsService = async () => {
  return await Hotel.find().populate("user", "firstName lastName email");
};

//get hotel by id
export const getHotelByIdService = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId).populate(
    "user",
    "firstName lastName email",
  );

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  return hotel;
};

//approve hotel
export const approveHotelService = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status !== "pending") {
    throw new Error("Hotel already processed.");
  }

  hotel.status = "approved";

  await hotel.save();

  return hotel;
};

//reject hotel
export const rejectHotelService = async (hotelId, reason) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status !== "pending") {
    throw new Error("Hotel already processed.");
  }

  hotel.status = "rejected";

  hotel.rejectionReason = reason;

  await hotel.save();

  return hotel;
};
