import { getApprovedHotelsService, getApprovedHotelByIdService } from "../services/customerService.js";

//get approved hotels
export const getApprovedHotels = async (req, res) => {
  try {
    const hotels = await getApprovedHotelsService();

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

//get single approved hotel
export const getApprovedHotelById = async (req, res) => {
  try {
    const hotel = await getApprovedHotelByIdService(req.params.id);

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
