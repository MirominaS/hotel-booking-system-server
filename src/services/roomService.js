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

  const roomType = await RoomType.findById(data.roomTypeId);

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
    roomType: data.roomTypeId,
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

export const updateRoomService = async (userId, hotelId, roomId, data) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (hotel.user.toString() !== userId.toString()) {
    throw new Error("You don't own this hotel");
  }

  const room = await Room.findOne({
    _id: roomId,
    hotel: hotelId,
    isActive: true,
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (data.roomTypeId) {
    const roomType = await RoomType.findById(data.roomTypeId);

    if (!roomType) {
      throw new Error("Room type not found");
    }

    if (roomType.hotel.toString() !== hotelId.toString()) {
      throw new Error("This room type doesn't belong to this hotel");
    }

    room.roomType = data.roomTypeId;
  }

  if (data.roomNumber && data.roomNumber !== room.roomNumber) {
    const existingRoom = await Room.findOne({
      hotel: hotelId,
      roomNumber: data.roomNumber,
      _id: { $ne: roomId },
      isActive: true,
    });

    if (existingRoom) {
      throw new Error("Room number already exists");
    }

    room.roomNumber = data.roomNumber;
  }

  if (data.mode) {
    room.mode = data.mode;
  }

  return await room.save();
};

export const deleteRoomService = async (userId, hotelId, roomId) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  if (hotel.user.toString() !== userId.toString()) {
    throw new Error("You don't own this hotel");
  }

  const room = await Room.findOne({
    _id: roomId,
    hotel: hotelId,
    isActive: true,
  });

  if (!room) {
    throw new Error("Room not found");
  }

  room.isActive = false;

  return await room.save();
};
