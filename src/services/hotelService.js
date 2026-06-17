import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Media from "../models/Media.js";

//apply for hotel onwer
export const createHotelService = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role !== "hotel_owner") {
    throw new Error("Only hotel owners can create hotels.");
  }

  // Validate hotel license
  if (data.documents?.hotelLicense) {
    const license = await Media.findById(data.documents.hotelLicense);

    if (!license || license.uploadedBy.toString() !== userId.toString()) {
      throw new Error("You can only use your own uploaded hotel license.");
    }
  }

  // Validate hotel images
  if (data.images?.length) {
    const images = await Media.find({
      _id: { $in: data.images },
      uploadedBy: userId,
    });

    if (images.length !== data.images.length) {
      throw new Error("You can only use your own uploaded images.");
    }
  }

  return await Hotel.create({
    user: userId,
    ...data,
  });
};

//get
export const getMyHotelsService = async (userId) => {
  return await Hotel.find({
    user: userId,
  }).populate("user", "firstName lastName email");
};

export const getMyHotelByIdService = async (userId, hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    user: userId,
  })
    .populate("user", "firstName lastName email")
    .populate("images", "key originalName mimeType visibility")
    .populate("documents.hotelLicense", "key originalName mimeType");

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  return hotel;
};
