import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import { getBookingState } from "../utils/bookingState.js";
import { handleServiceError } from "../utils/handleServiceError.js";

const canCancelBooking = (booking) => {
  const now = new Date();

  const hours = (booking.checkInDate - now) / (1000 * 60 * 60);

  return hours >= 5;
};

//check availability
export const checkAvailabilityService = async (data) => {
  try {
    const { hotelId, roomTypeId, numberOfRooms, checkInDate, checkOutDate } =
      data;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    if (hotel.status !== "approved" || !hotel.isActive) {
      throw new Error("Hotel is not available");
    }

    const roomType = await RoomType.findById(roomTypeId);

    if (!roomType) {
      throw new Error("Room type not found");
    }

    if (roomType.hotel.toString() !== hotelId.toString()) {
      throw new Error("Invalid room type");
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today || checkIn >= checkOut) {
      throw new Error("Invalid booking dates");
    }

    const bookedRoomIds = await Booking.distinct("room", {
      $or: [
        {
          status: "confirmed",
        },
        {
          status: "pending",
          holdExpiresAt: {
            $gt: new Date(),
          },
        },
      ],
      checkInDate: {
        $lt: checkOut,
      },
      checkOutDate: {
        $gt: checkIn,
      },
    });

    const availableRooms = await Room.find({
      hotel: hotelId,
      roomType: roomTypeId,
      isActive: true,
      _id: { $nin: bookedRoomIds },
    })
      .select("_id roomNumber")
      .lean();

    return {
      available: availableRooms.length >= numberOfRooms,
      availableCount: availableRooms.length,
      rooms: availableRooms,
    };
  } catch (error) {
    handleServiceError("checkAvailabilityService", error);
  }
};

//create booking
export const createBookingService = async (userId, data) => {
  try {
    const {
      hotelId,
      roomTypeId,
      roomIds,
      numberOfGuests,
      checkInDate,
      checkOutDate,
    } = data;

    if (!roomIds?.length) {
      throw new Error("Please select at least one room");
    }
    const numberOfRooms = roomIds.length;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    if (hotel.status !== "approved" || !hotel.isActive) {
      throw new Error("Hotel not available");
    }

    const roomType = await RoomType.findOne({
      _id: roomTypeId,
      hotel: hotelId,
    });

    if (!roomType) {
      throw new Error("Invalid room type");
    }

    const maxGuests = roomType.capacity * numberOfRooms;

    if (numberOfGuests > maxGuests) {
      throw new Error(`Maximum ${maxGuests} guests allowed`);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today || checkIn >= checkOut) {
      throw new Error("Invalid booking dates");
    }

    const selectedRooms = await Room.find({
      _id: { $in: roomIds },
      hotel: hotelId,
      roomType: roomTypeId,
      isActive: true,
    })
      .select("_id roomNumber")
      .lean();

    if (selectedRooms.length !== roomIds.length) {
      throw new Error("Invalid room selection");
    }

    const bookedRoomIds = await Booking.distinct("room", {
      room: { $in: roomIds },
      $or: [
        {
          status: "confirmed",
        },
        {
          status: "pending",
          holdExpiresAt: {
            $gt: new Date(),
          },
        },
      ],
      checkInDate: {
        $lt: checkOut,
      },
      checkOutDate: {
        $gt: checkIn,
      },
    });

    if (bookedRoomIds.length > 0) {
      throw new Error("One or more selected rooms are no longer available.");
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const bookingReference = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const bookings = [];

    for (let i = 0; i < numberOfRooms; i++) {
      bookings.push({
        bookingReference,
        customer: userId,
        hotel: hotelId,
        room: selectedRooms[i]._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: i === 0 ? numberOfGuests : 0,
        totalPrice: roomType.pricePerNight * nights,
        status: "pending",
        payment: null,
        holdExpiresAt,
      });
    }

    const createdBookings = await Booking.insertMany(bookings);

    return {
      bookingReference,
      holdExpiresAt,
      bookings: createdBookings,
    };
  } catch (error) {
    handleServiceError("createBookingService", error);
  }
};

export const getMyBookingsService = async (userId) => {
  try {
    const bookings = await Booking.find({ customer: userId })
      .populate("hotel", "hotelName")
      .populate({
        path: "room",
        populate: {
          path: "roomType",
        },
      })
      .sort({
        createdAt: -1,
      });

    return bookings.map((booking) => ({
      ...booking.toObject(),
      bookingState: getBookingState(booking),
    }));
  } catch (error) {
    handleServiceError("getMyBookingsService", error);
  }
};

export const getBookingGroupService = async (userId, bookingReference) => {
  try {
    const bookings = await Booking.find({
      customer: userId,
      bookingReference,
    })
      .populate("hotel")
      .populate({
        path: "room",
        populate: {
          path: "roomType",
        },
      });

    return bookings.map((booking) => ({
      ...booking.toObject(),
      bookingState: getBookingState(booking),
    }));
  } catch (error) {
    handleServiceError("getBookingGroupService", error);
  }
};

export const cancelBookingService = async (userId, bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.customer.toString() !== userId.toString()) {
      throw new Error("Unauthorized");
    }
    if (booking.status !== "cancelled" && !canCancelBooking(booking)) {
      throw new Error(
        "Bookings cannot be cancelled within 5 hours of check-in.",
      );
    }

    booking.status = "cancelled";

    await booking.save();

    return booking;
  } catch (error) {
    handleServiceError("cancelBookingService", error);
  }
};

export const cancelBookingGroupService = async (userId, bookingReference) => {
  try {
    const bookings = await Booking.find({
      customer: userId,
      bookingReference,
    });

    if (!bookings.length) {
      throw new Error("Bookings not found");
    }

    for (const booking of bookings) {
      if (booking.status !== "cancelled" && !canCancelBooking(booking)) {
        throw new Error(
          "Bookings cannot be cancelled within 5 hours of check-in.",
        );
      }
    }

    for (const booking of bookings) {
      if (booking.status === "cancelled") {
        continue;
      }

      booking.status = "cancelled";

      await booking.save();
    }

    return bookings;
  } catch (error) {
    handleServiceError("cancelBookingGroupService", error);
  }
};
