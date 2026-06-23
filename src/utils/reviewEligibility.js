import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import HotelOwner from "../models/HotelOwner.js";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";

const completedBooking = {
  status: "confirmed",
  checkInDate: {
    $lte: new Date(),
  },
};

export const canReviewHotel = async (userId, hotelId) => {
  const booking = await Booking.findOne({
    customer: userId,
    hotel: hotelId,
    ...completedBooking,
  });
  return !!booking;
};

export const canReviewRoomType = async (userId, roomTypeId) => {
  const roomIds = await Room.find({
    roomType: roomTypeId,
  }).distinct("_id");

  if (!roomIds.length) {
    return false;
  }
  const booking = await Booking.findOne({
    customer: userId,
    room: {
      $in: roomIds,
    },
    ...completedBooking,
  });

  return !!booking;
};

export const canReviewOwner = async (userId, ownerId) => {
  const hotelIds = await Hotel.find({
    user: ownerId,
  }).distinct("_id");

  if (!hotelIds.length) {
    return false;
  }

  const booking = await Booking.findOne({
    customer: userId,
    hotel: {
      $in: hotelIds,
    },
    ...completedBooking,
  });

  return !!booking;
};

export const canReviewEntity = async (userId, reviewableType, reviewableId) => {
  switch (reviewableType) {
    case "Hotel":
      return canReviewHotel(userId, reviewableId);

    case "RoomType":
      return canReviewRoomType(userId, reviewableId);

    case "HotelOwner":
      return canReviewOwner(userId, reviewableId);

    default:
      throw new Error("Invalid review type.");
  }
};
