import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
//single hotel
export const getHotelOverviewService = async (userId, hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    user: userId,
  });

  if (!hotel) {
    throw new Error("Hotel not found or unauthorized");
  }

  const now = new Date();

  const [
    totalBookings,
    upcomingBookings,
    cancelledBookings,
    averageStayResult,
  ] = await Promise.all([
    Booking.countDocuments({
      hotel: hotelId,
    }),

    Booking.countDocuments({
      hotel: hotelId,
      status: "confirmed",
      checkInDate: {
        $gte: now,
      },
    }),

    Booking.countDocuments({
      hotel: hotelId,
      status: "cancelled",
    }),

    Booking.aggregate([
      {
        $match: {
          hotel: hotel._id,
          status: "confirmed",
        },
      },
      {
        $project: {
          stayDays: {
            $divide: [
              {
                $subtract: ["$checkOutDate", "$checkInDate"],
              },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageStay: {
            $avg: "$stayDays",
          },
        },
      },
    ]),
  ]);

  const cancellationRate =
    totalBookings > 0
      ? ((cancelledBookings / totalBookings) * 100).toFixed(1)
      : 0;

  return {
    totalBookings,
    upcomingBookings,
    cancelledBookings,
    cancellationRate: Number(cancellationRate),
    averageStay: averageStayResult[0]?.averageStay
      ? Number(averageStayResult[0].averageStay.toFixed(1))
      : 0,
  };
};

export const getMonthlyRevenueService = async (userId, hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    user: userId,
  });

  if (!hotel) {
    throw new Error("Hotel not found or unauthorized");
  }

  const revenue = await Booking.aggregate([
    {
      $match: {
        hotel: hotel._id,
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        revenue: {
          $sum: "$totalPrice",
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
  }));
};

export const getBookingStatusService = async (userId, hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    user: userId,
  });

  if (!hotel) {
    throw new Error("Hotel not found or unauthorized");
  }

  const statusData = await Booking.aggregate([
    {
      $match: {
        hotel: hotel._id,
      },
    },
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
  };

  statusData.forEach((item) => {
    result[item._id] = item.count;
  });

  return result;
};

export const getTopRoomTypesService = async (userId, hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    user: userId,
  });

  if (!hotel) {
    throw new Error("Hotel not found or unauthorized");
  }

  return await Booking.aggregate([
    {
      $match: {
        hotel: hotel._id,
        status: "confirmed",
      },
    },
    {
      $lookup: {
        from: "rooms",
        localField: "room",
        foreignField: "_id",
        as: "room",
      },
    },
    {
      $unwind: "$room",
    },
    {
      $lookup: {
        from: "roomtypes",
        localField: "room.roomType",
        foreignField: "_id",
        as: "roomType",
      },
    },
    {
      $unwind: "$roomType",
    },
    {
      $group: {
        _id: "$roomType._id",
        roomTypeName: {
          $first: "$roomType.name",
        },
        bookings: {
          $sum: 1,
        },
        revenue: {
          $sum: "$totalPrice",
        },
      },
    },
    {
      $sort: {
        bookings: -1,
      },
    },
  ]);
};

//overall hotels
export const getOwnerOverviewService = async (userId) => {
  const hotels = await Hotel.find({
    user: userId,
  }).select("_id");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const now = new Date();

  const [
    totalHotels,
    totalBookings,
    upcomingBookings,
    cancelledBookings,
    averageStayResult,
    revenueResult,
  ] = await Promise.all([
    Hotel.countDocuments({
      user: userId,
    }),

    Booking.countDocuments({
      hotel: {
        $in: hotelIds,
      },
    }),

    Booking.countDocuments({
      hotel: {
        $in: hotelIds,
      },
      status: "confirmed",
      checkInDate: {
        $gte: now,
      },
    }),

    Booking.countDocuments({
      hotel: {
        $in: hotelIds,
      },
      status: "cancelled",
    }),

    Booking.aggregate([
      {
        $match: {
          hotel: {
            $in: hotelIds,
          },
          status: "confirmed",
        },
      },
      {
        $project: {
          stayDays: {
            $divide: [
              {
                $subtract: ["$checkOutDate", "$checkInDate"],
              },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageStay: {
            $avg: "$stayDays",
          },
        },
      },
    ]),

    Booking.aggregate([
      {
        $match: {
          hotel: {
            $in: hotelIds,
          },
          status: "confirmed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),
  ]);

  const cancellationRate =
    totalBookings > 0
      ? Number(((cancelledBookings / totalBookings) * 100).toFixed(1))
      : 0;

  return {
    totalHotels,
    totalBookings,
    upcomingBookings,
    cancelledBookings,
    cancellationRate,
    averageStay: averageStayResult[0]?.averageStay
      ? Number(averageStayResult[0].averageStay.toFixed(1))
      : 0,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
  };
};

export const getOwnerMonthlyRevenueService = async (userId) => {
  const hotels = await Hotel.find({
    user: userId,
  }).select("_id");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const revenue = await Booking.aggregate([
    {
      $match: {
        hotel: {
          $in: hotelIds,
        },
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        revenue: {
          $sum: "$totalPrice",
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
  }));
};

export const getOwnerBookingStatusService = async (userId) => {
  const hotels = await Hotel.find({
    user: userId,
  }).select("_id");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const statusData = await Booking.aggregate([
    {
      $match: {
        hotel: {
          $in: hotelIds,
        },
      },
    },
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
  };

  statusData.forEach((item) => {
    result[item._id] = item.count;
  });

  return result;
};

export const getTopHotelsService = async (userId) => {
  return await Booking.aggregate([
    {
      $lookup: {
        from: "hotels",
        localField: "hotel",
        foreignField: "_id",
        as: "hotel",
      },
    },
    {
      $unwind: "$hotel",
    },
    {
      $match: {
        "hotel.user": userId,
        status: "confirmed",
      },
    },
    {
      $group: {
        _id: "$hotel._id",
        hotelName: {
          $first: "$hotel.hotelName",
        },
        bookings: {
          $sum: 1,
        },
        revenue: {
          $sum: "$totalPrice",
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);
};
