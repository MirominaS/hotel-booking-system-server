import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

//apply for hotel onwer
export const createHotelService = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role !== "hotel_owner") {
    throw new Error("Only hotel owners can create hotels.");
  }

  return await Hotel.create({
    user: userId,
    ...data,
  });
};

//get
export const getMyHotelsService = async (userId) => {
  return await Hotel.find({
    user: userId,
  }).populate("user", "firstName lastName email");
};

export const getMyHotelByIdService = async (userId, hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    user: userId,
  }).populate("user", "firstName lastName email");

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  return hotel;
};
