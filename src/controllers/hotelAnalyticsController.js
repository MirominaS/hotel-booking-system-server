import {
  getHotelOverviewService,
  getMonthlyRevenueService,
  getBookingStatusService,
  getTopRoomTypesService,
  getOwnerOverviewService,
  getOwnerMonthlyRevenueService,
  getOwnerBookingStatusService,
  getTopHotelsService,
} from "../services/hotelAnalyticsService.js";

export const getHotelOverview = async (req, res) => {
  try {
    const overview = await getHotelOverviewService(
      req.user._id,
      req.params.hotelId,
    );

    res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  try {
    const revenue = await getMonthlyRevenueService(
      req.user._id,
      req.params.hotelId,
    );

    res.status(200).json({
      success: true,
      revenue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingStatus = async (req, res) => {
  try {
    const status = await getBookingStatusService(
      req.user._id,
      req.params.hotelId,
    );

    res.status(200).json({
      success: true,
      status,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTopRoomTypes = async (req, res) => {
  try {
    const roomTypes = await getTopRoomTypesService(
      req.user._id,
      req.params.hotelId,
    );

    res.status(200).json({
      success: true,
      roomTypes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerOverview = async (req, res) => {
  try {
    const overview = await getOwnerOverviewService(req.user._id);

    res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerMonthlyRevenue = async (req, res) => {
  try {
    const revenue = await getOwnerMonthlyRevenueService(req.user._id);

    res.status(200).json({
      success: true,
      revenue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerBookingStatus = async (req, res) => {
  try {
    const status = await getOwnerBookingStatusService(req.user._id);

    res.status(200).json({
      success: true,
      status,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTopHotels = async (req, res) => {
  try {
    const hotels = await getTopHotelsService(req.user._id);

    res.status(200).json({
      success: true,
      hotels,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
