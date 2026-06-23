import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import RoomType from "../models/RoomType.js";
import { attachSignedUrls } from "../utils/mediaUrl.js";
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
      .populate("images", "key originalName")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Hotel.countDocuments(filter),
  ]);

  const hotelsWithUrls = await Promise.all(
    hotels.map(async (hotel) => ({
      ...hotel.toObject(),
      images: await attachSignedUrls(hotel.images),
    })),
  );

  return {
    hotels: hotelsWithUrls,
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
  })
    .populate("user", "firstName lastName")
    .populate("images", "key originalName");

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  hotel.images = await attachSignedUrls(hotel.images);

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
      .populate({
        path: "roomType",
        select: "name capacity pricePerNight amenities description",
      })
      .populate({
        path: "images",
        select: "key originalName",
      })
      .sort({ roomNumber: 1 })
      .skip(skip)
      .limit(limit),

    Room.countDocuments(filter),
  ]);

  const roomsWithUrls = await Promise.all(
    rooms.map(async (room) => {
      const roomObj = room.toObject();

      if (roomObj.images) {
        roomObj.images = await attachSignedUrls(roomObj.images);
      }

      return roomObj;
    }),
  );
  return {
    rooms: roomsWithUrls,
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
  const room = await Room.findById(roomId)
    .populate("hotel", "hotelName status")
    .populate({
      path: "roomType",
      select: "name description capacity pricePerNight amenities",
    })
    .populate({
      path: "images",
      select: "key originalName",
    });

  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.hotel.status !== "approved") {
    throw new Error("Room is not available.");
  }

  const roomObj = room.toObject();

  if (roomObj.images) {
    roomObj.images = await attachSignedUrls(roomObj.images);
  }

  return roomObj;
};

export const searchHotelsService = async ({
  city,
  checkIn,
  checkOut,
  guests,
}) => {

  const roomTypes = await RoomType.find({
    capacity: { $gte: guests },
  });

  const bookedRooms = await Booking.find({
    status: "confirmed",
    checkInDate: {
      $lt: new Date(checkOut),
    },
    checkOutDate: {
      $gt: new Date(checkIn),
    },
  }).distinct("room");

  const availableRooms = await Room.find({
    roomType: {
      $in: roomTypes.map(rt => rt._id),
    },
    _id: {
      $nin: bookedRooms,
    },
    isActive: true,
  });

  const hotelIds = [
    ...new Set(
      availableRooms.map(room => room.hotel.toString())
    ),
  ];

  return await Hotel.find({
    _id: { $in: hotelIds },
    city: {
      $regex: city,
      $options: "i",
    },
    status: "approved",
    isActive: true,
  }).populate("images");
};