import {
  getAdminBookingStatusService,
  getAdminOverviewService,
  getAdminRevenueService,
} from "../services/adminAnalyticsService.js";

export const getAdminOverview = async (req, res) => {
  try {
    const overview = await getAdminOverviewService();
    res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminRevenue = async (req, res) => {
  try {
    const revenue = await getAdminRevenueService();

    res.status(200).json({
      success: true,
      revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminBookingStatus = async (req, res) => {
  try {
    const statusData = await getAdminBookingStatusService();
    res.status(200).json({
      success: true,
      statusData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
