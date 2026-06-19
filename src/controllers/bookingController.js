import {
  checkAvailabilityService,
  createBookingService,
  getMyBookingsService,
  getBookingGroupService,
  cancelBookingService,
  cancelBookingGroupService,
  getOwnerBookingsService,
  getOwnerBookingGroupService,
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

export const getOwnerBookings = async (req, res) => {
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const results = await getOwnerBookingsService(
      req.user._id,
      page,
      limit,
      skip,
    );

    res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.log("OWNER BOOKING", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerBookingGroup = async (req, res) => {
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const results = await getOwnerBookingGroupService(
      req.user._id,
      req.params.bookingReference,
      page,
      limit,
      skip,
    );

    res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
