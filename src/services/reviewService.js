import Review from "../models/Review.js";
import mongoose from "mongoose";
import { canReviewEntity } from "../utils/reviewEligibility.js";
import Hotel from "../models/Hotel.js";
import RoomType from "../models/RoomType.js";

export const createReviewService = async (
  userId,
  reviewableType,
  reviewableId,
  rating,
  title,
  comment,
) => {
  console.log("userId", userId);
  const eligible = await canReviewEntity(userId, reviewableType, reviewableId);

  if (!eligible) {
    throw new Error("You are not eligible to review this item.");
  }

  const existingReview = await Review.findOne({
    customer: userId,
    reviewableType,
    reviewableId,
    isActive: true,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this item.");
  }

  const review = await Review.create({
    customer: userId,
    reviewableType,
    reviewableId,
    rating,
    title,
    comment,
  });

  return review;
};

export const getHotelReviewsService = async (hotelId, page, limit, skip) => {
  const filter = {
    reviewableType: "Hotel",
    reviewableId: hotelId,
    isActive: true,
  };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments(filter),
  ]);

  return {
    reviews,
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

export const getRoomTypeReviewsService = async (
  roomTypeId,
  page,
  limit,
  skip,
) => {
  const filter = {
    reviewableType: "RoomType",
    reviewableId: roomTypeId,
    isActive: true,
  };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("customer", "firstName lastName")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Review.countDocuments(filter),
  ]);

  return {
    reviews,
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

export const getOwnerReviewsService = async (ownerId, page, limit, skip) => {
  const filter = {
    reviewableType: "HotelOwner",
    reviewableId: ownerId,
    isActive: true,
  };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("customer", "firstName lastName")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Review.countDocuments(filter),
  ]);

  return {
    reviews,
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

export const updateReviewService = async (userId, reviewId, data) => {
  const review = await Review.findOne({
    _id: reviewId,
    isActive: true,
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.customer.toString() !== userId.toString()) {
    throw new Error("Unauthorized.");
  }

  if (data.rating !== undefined) {
    review.rating = data.rating;
  }

  if (data.title !== undefined) {
    review.title = data.title;
  }

  if (data.comment !== undefined) {
    review.comment = data.comment;
  }

  return await review.save();
};

export const deleteReviewService = async (userId, role, reviewId) => {
  const review = await Review.findOne({
    _id: reviewId,
    isActive: true,
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  const isOwner = review.customer.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized.");
  }

  review.isActive = false;

  return await review.save();
};

export const getHotelReviewSummaryService = async (hotelId) => {
  const result = await Review.aggregate([
    {
      $match: {
        reviewableType: "Hotel",
        reviewableId: new mongoose.Types.ObjectId(hotelId),
        isActive: true,
      },
    },

    {
      $group: {
        _id: null,

        averageRating: {
          $avg: "$rating",
        },

        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (!result.length) {
    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }

  return {
    averageRating: Number(result[0].averageRating.toFixed(1)),
    reviewCount: result[0].reviewCount,
  };
};

export const getAllReviewsService = async (page, limit, skip) => {
  const [reviews, total] = await Promise.all([
    Review.find({
      isActive: true,
    })
      .populate("customer", "firstName lastName email")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Review.countDocuments({
      isActive: true,
    }),
  ]);

  const enrichedReviews = await Promise.all(
    reviews.map(async (review) => {
      let target = null;

      if (review.reviewableType === "Hotel") {
        target = await Hotel.findById(review.reviewableId)
          .populate("user", "firstName lastName")
          .select("hotelName user");
      }

      if (review.reviewableType === "RoomType") {
        target = await RoomType.findById(review.reviewableId)
          .populate({
            path: "hotel",
            select: "hotelName user",
            populate: {
              path: "user",
              select: "firstName lastName",
            },
          })
          .select("name hotel");
      }

      if (review.reviewableType === "HotelOwner") {
        target = await HotelOwner.findById(review.reviewableId).populate(
          "user",
          "firstName lastName",
        );
      }

      return {
        ...review.toObject(),
        target,
      };
    }),
  );

  return {
    reviews: enrichedReviews,
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

export const canReviewService = async (
  userId,
  reviewableType,
  reviewableId,
) => {
  const canReview = await canReviewEntity(userId, reviewableType, reviewableId);

  return {
    canReview,
  };
};

export const getMyOwnerReviewsService = async (userId, page, limit, skip) => {
  const [reviews, total] = await Promise.all([
    Review.find({
      reviewableType: "HotelOwner",
      reviewableId: userId,
      isActive: true,
    })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments({
      reviewableType: "HotelOwner",
      reviewableId: userId,
      isActive: true,
    }),
  ]);

  return {
    reviews,
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

export const getMyHotelReviewsService = async (userId, page, limit, skip) => {
  const hotels = await Hotel.find({
    user: userId,
    isActive: true,
  }).select("_id hotelName");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const [reviews, total] = await Promise.all([
    Review.find({
      reviewableType: "Hotel",
      reviewableId: {
        $in: hotelIds,
      },
      isActive: true,
    })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments({
      reviewableType: "Hotel",
      reviewableId: {
        $in: hotelIds,
      },
      isActive: true,
    }),
  ]);

  return {
    reviews,
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

export const getMyRoomReviewsService = async (userId, page, limit, skip) => {
  const hotels = await Hotel.find({
    user: userId,
    isActive: true,
  }).select("_id");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const roomTypes = await RoomType.find({
    hotel: {
      $in: hotelIds,
    },
    isActive: true,
  }).select("_id");

  const roomTypeIds = roomTypes.map((room) => room._id);

  const [reviews, total] = await Promise.all([
    Review.find({
      reviewableType: "RoomType",
      reviewableId: {
        $in: roomTypeIds,
      },
      isActive: true,
    })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments({
      reviewableType: "RoomType",
      reviewableId: {
        $in: roomTypeIds,
      },
      isActive: true,
    }),
  ]);

  return {
    reviews,
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
