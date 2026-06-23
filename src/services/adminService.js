import Hotel from "../models/Hotel.js";
import HotelOwner from "../models/HotelOwner.js";
import { generateSignedUrl, attachSignedUrls } from "../utils/mediaUrl.js";

//get all hotels
export const getAllHotelsService = async () => {
  return await Hotel.find()
    .populate("user", "firstName lastName email")
    .populate("images")
    .populate("documents.hotelLicense");
};

//get hotel by id
export const getHotelByIdService = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId)
    .populate("user", "firstName lastName email")
    .populate("images")
    .populate("documents.hotelLicense");

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  return hotel;
};

//approve hotel
export const approveHotelService = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status !== "pending") {
    throw new Error("Hotel already processed.");
  }

  hotel.status = "approved";

  await hotel.save();

  return hotel;
};

//reject hotel
export const rejectHotelService = async (hotelId, reason) => {
  const hotel = await Hotel.findById(hotelId);

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status !== "pending") {
    throw new Error("Hotel already processed.");
  }

  hotel.status = "rejected";

  hotel.rejectionReason = reason;

  await hotel.save();

  return hotel;
};

export const getHotelReviewService = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId)
    .populate("user", "firstName lastName email")
    .populate("images")
    .populate("documents.hotelLicense");

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  const ownerProfile = await HotelOwner.findOne({
    user: hotel.user._id,
  })
    .populate("documents.ownerNicFront")
    .populate("documents.ownerNicBack");

  const hotelObj = hotel.toObject();

  // Hotel Images
  hotelObj.images = await attachSignedUrls(hotel.images);

  // Hotel License
  if (hotel.documents?.hotelLicense) {
    hotelObj.documents.hotelLicense = {
      _id: hotel.documents.hotelLicense._id,
      originalName: hotel.documents.hotelLicense.originalName,
      url: await generateSignedUrl(
        hotel.documents.hotelLicense.key
      ),
    };
  }

  let ownerProfileObj = null;

  if (ownerProfile) {
    ownerProfileObj = ownerProfile.toObject();

    // NIC Front
    if (ownerProfile.documents?.ownerNicFront) {
      ownerProfileObj.documents.ownerNicFront = {
        _id: ownerProfile.documents.ownerNicFront._id,
        originalName:
          ownerProfile.documents.ownerNicFront.originalName,
        url: await generateSignedUrl(
          ownerProfile.documents.ownerNicFront.key
        ),
      };
    }

    // NIC Back
    if (ownerProfile.documents?.ownerNicBack) {
      ownerProfileObj.documents.ownerNicBack = {
        _id: ownerProfile.documents.ownerNicBack._id,
        originalName:
          ownerProfile.documents.ownerNicBack.originalName,
        url: await generateSignedUrl(
          ownerProfile.documents.ownerNicBack.key
        ),
      };
    }
  }

  return {
    hotel: hotelObj,
    ownerProfile: ownerProfileObj,
  };
};