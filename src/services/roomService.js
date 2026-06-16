import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";

export const createRoomService = async (userId, hotelId, data) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (hotel.user.toString() !== userId.toString()) {
    throw new Error("You don't own this hotel");
  }

  if (hotel.status !== "approved") {
    throw new Error("Hotel is awaiting approval.");
  }

  const roomType = await RoomType.findById(data.roomType);

  if (!roomType) {
    throw new Error("Room type not found");
  }

  if (roomType.hotel.toString() !== hotelId.toString()) {
    throw new Error("This room type doesn't belong to this hotel");
  }

  const existingRoom = await Room.findOne({
    hotel: hotelId,
    roomNumber: data.roomNumber,
  });

  if (existingRoom) {
    throw new Error("Room number already exists");
  }

  return await Room.create({
    hotel: hotelId,
    roomType: data.roomType,
    roomNumber: data.roomNumber,
    mode: data.mode,
  });
};

export const getHotelRoomService = async (hotelId) => {
  return await Room.find({
    hotel: hotelId,
    isActive: true,
  })
    .populate("roomType", "name capacity pricePerNight")
    .sort({
      roomNumber: 1,
    });
};

export const getRoomByIdService = async (roomId) => {
  const room = await Room.findById(roomId)
    .populate("hotel", "hotelName")
    .populate(
      "roomType",
      "name description capacity pricePerNight amenities images",
    );

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
};
