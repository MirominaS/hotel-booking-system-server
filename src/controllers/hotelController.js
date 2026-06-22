import {
  createHotelService,
  getMyHotelsService,
  getMyHotelByIdService,
  updateHotelService,
  deleteHotelService,
} from "../services/hotelService.js";

export const createHotel = async (req, res) => {
  try {
    const hotel = await createHotelService(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Hotel created successfully.",
      hotel,
    });
  } catch (error) {
    console.log("ERROR CREATE HOTEL:",error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get
export const getMyHotels = async (req, res) => {
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const result = await getMyHotelsService(req.user._id, page, limit, skip);

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
export const getMyHotelById = async (req, res) => {
  try {
    const hotel = await getMyHotelByIdService(req.user._id, req.params.id);

    res.json({
      success: true,
      hotel,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await updateHotelService(
      req.user.id,
      req.params.id,
      req.body,
    );

    res.status(200).json(hotel);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    await deleteHotelService(req.user.id, req.params.id);

    res.status(200).json({
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
