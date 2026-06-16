import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js"

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

//available rooms
export const getAvailableHotelRoomsService = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status !== "approved") {
    throw new Error("Hotel is not available.");
  }

  return await Room.find({
    hotel: hotelId,
    isActive: true,
  });
};

//available room by id
export const getAvailableRoomByIdService = async (roomId) => {
  const room = await Room.findById(roomId).populate(
    "hotel",
    "hotelName status",
  );

  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.hotel.status !== "approved") {
    throw new Error("Room is not available.");
  }

  return room;
};
