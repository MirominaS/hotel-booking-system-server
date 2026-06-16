import {
  createHotelService,
  getMyHotelsService,
  getMyHotelByIdService
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get
export const getMyHotels = async (req, res) => {
  try {
    const hotels = await getMyHotelsService(req.user._id);

    res.json({
      success: true,
      hotels,
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
