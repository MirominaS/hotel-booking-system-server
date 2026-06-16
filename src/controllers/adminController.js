import {
  getAllHotelsService,
  getHotelByIdService,
  approveHotelService,
  rejectHotelService,
} from "../services/adminService.js";

export const getAllHotels = async (req, res) => {
  try {
    const hotels = await getAllHotelsService();

    res.status(200).json({
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

export const getHotelById = async (req, res) => {
  try {
    const hotel = await getHotelByIdService(req.params.id);

    res.status(200).json({
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

export const approveHotel = async (req, res) => {
  try {
    const hotel = await approveHotelService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Hotel approved successfully.",
      hotel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectHotel = async (req, res) => {
  try {
    const { reason } = req.body;

    const hotel = await rejectHotelService(req.params.id, reason);

    res.status(200).json({
      success: true,
      message: "Hotel rejected successfully.",
      hotel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
