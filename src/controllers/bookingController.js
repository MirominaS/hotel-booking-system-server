import {
  checkAvailabilityService,
  createBookingService,
  getMyBookingsService,
  getBookingGroupService,
  cancelBookingService,
  cancelBookingGroupService,
} from "../services/bookingService.js";

export const checkAvailability = async (req, res) => {
  try {
    const result = await checkAvailabilityService(req.body);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const bookings = await createBookingService(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await getMyBookingsService(req.user._id);

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingGroup = async (req, res) => {
  try {
    const bookings = await getBookingGroupService(
      req.user._id,
      req.params.bookingReference,
    );

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await cancelBookingService(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelBookingGroup = async (req, res) => {
  try {
    const bookings = await cancelBookingGroupService(
      req.user._id,
      req.params.bookingReference,
    );

    res.status(200).json({
      success: true,
      message: "Bookings cancelled successfully.",
      bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
