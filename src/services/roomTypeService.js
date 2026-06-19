import Hotel from "../models/Hotel.js";
import RoomType from "../models/RoomType.js";

export const createRoomTypeService = async (userId, hotelId, data) => {
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

  const existingRoomType = await RoomType.findOne({
    hotel: hotelId,
    name: data.name,
  });

  if (existingRoomType) {
    throw new Error("Room type already exists");
  }

  return await RoomType.create({
    hotel: hotelId,
    ...data,
  });
};

export const getHotelRoomTypesService = async (hotelId) => {
  return await RoomType.find({
    hotel: hotelId,
    isActive: true,
  });
};

export const getRoomTypeByIdService = async (roomTypeId) => {
  const roomType = await RoomType.findById(roomTypeId);

  if (!roomType) {
    throw new Error("Room type not found");
  }

  return roomType;
};

export const updateRoomTypeService = async (userId, roomTypeId, data) => {
  const roomType = await RoomType.findById(roomTypeId).populate("hotel");

  if (!roomType) {
    throw new Error("Room type not found");
  }

  if (roomType.hotel.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  Object.assign(roomType, data);

  return await roomType.save();
};

export const deleteRoomTypeService = async (userId, roomTypeId) => {
  const roomType = await RoomType.findById(roomTypeId).populate("hotel");

  if (!roomType) {
    throw new Error("Room type not found");
  }

  if (roomType.hotel.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  roomType.isActive = false;

  return await roomType.save();
};
