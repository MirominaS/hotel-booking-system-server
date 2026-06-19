import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

export const getAdminOverviewService = async () => {
  const [
    totalCustomers,
    totalOwners,
    totalHotels,
    approvedHotels,
    pendingHotels,
    totalRooms,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments({ role: "customer" }),

    User.countDocuments({ role: "hotel_owner" }),

    Hotel.countDocuments(),

    Hotel.countDocuments({ status: "approved", isActive: true }),

    Hotel.countDocuments({ status: "pending" }),

    Room.countDocuments({ isActive: true }),

    Booking.countDocuments(),

    Booking.countDocuments({ status: "confirmed" }),

    Booking.countDocuments({ status: "cancelled" }),

    Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]),
  ]);

  return {
    totalCustomers,
    totalOwners,
    totalHotels,
    approvedHotels,
    pendingHotels,
    totalRooms,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
  };
};

export const getAdminRevenueService = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: "paid",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: {
          $sum: "$amount",
        },
        payments: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  return revenue.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    revenue: item.revenue,
    payments: item.payments,
  }));
};

export const getAdminBookingStatusService = async () => {
  const statuses = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  const result = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    total: 0,
  };

  statuses.forEach((status) => {
    result[status._id] = status.count;
    result.total += status.count;
  });

  return result;
};
