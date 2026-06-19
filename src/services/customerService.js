import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

//get approved hotels
export const getApprovedHotelsService = async (
  page,
  limit,
  skip,
  status,
  search,
) => {
  const filter = { isActive: true };

  if (status) {
    filter.status = status;
  } else {
    filter.status = "approved";
  }

  if (search) {
    filter.hotelName = {
      $regex: search,
      $options: "i",
    };
  }
  const [hotels, total] = await Promise.all([
    Hotel.find(filter)
      .populate("user", "firstName lastName")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Hotel.countDocuments(filter),
  ]);
  return {
    hotels,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
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
export const getAvailableHotelRoomsService = async (
  hotelId,
  page,
  limit,
  skip,
) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status !== "approved") {
    throw new Error("Hotel is not available.");
  }

  const filter = {
    hotel: hotelId,
    isActive: true,
  };

  const [rooms, total] = await Promise.all([
    Room.find(filter)
      .populate("roomType", "name capacity pricePerNight images")
      .sort({ roomNumber: 1 })
      .skip(skip)
      .limit(limit),

    Room.countDocuments(filter),
  ]);

  return {
    rooms,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
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
