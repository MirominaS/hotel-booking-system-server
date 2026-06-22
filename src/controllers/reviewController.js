import {
  createReviewService,
  getHotelReviewsService,
  getOwnerReviewsService,
  getRoomTypeReviewsService,
  updateReviewService,
  deleteReviewService,
  getHotelReviewSummaryService,
  canReviewService,
} from "../services/reviewService.js";

export const createReview = async (req, res) => {
  try {
    const { reviewableType, reviewableId, rating, title, comment } = req.body;

    const review = await createReviewService(
      req.user._id,
      reviewableType,
      reviewableId,
      rating,
      title,
      comment,
    );
    res.status(201).json({
      success: true,
      message: "Review created successfully.",
      review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHotelReviews = async (req, res) => {
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const result = await getHotelReviewsService(
      req.params.hotelId,
      page,
      limit,
      skip,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRoomTypeReviews = async (req, res) => {
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const result = await getRoomTypeReviewsService(
      req.params.roomTypeId,
      page,
      limit,
      skip,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerReviews = async (req, res) => {
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const result = await getOwnerReviewsService(
      req.params.ownerId,
      page,
      limit,
      skip,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await updateReviewService(
      req.user._id,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await deleteReviewService(req.user._id, req.user.role, req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHotelReviewSummary = async (req, res) => {
  try {
    const summary = await getHotelReviewSummaryService(req.params.hotelId);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const result = await getAllReviewsService(page, limit, skip);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const canReview = async (req, res) => {
  try {
    const { reviewableType, reviewableId } = req.query;

    if (!reviewableType || !reviewableId) {
      return res.status(400).json({
        success: false,
        message: "reviewableType and reviewableId are required.",
      });
    }

    const result = await canReviewService(
      req.user._id,
      reviewableType,
      reviewableId,
    );

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

