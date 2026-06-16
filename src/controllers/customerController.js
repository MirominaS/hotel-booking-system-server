import {
  getApprovedHotelsService,
  getApprovedHotelByIdService,
  getAvailableHotelRoomsService,
  getAvailableRoomByIdService,
} from "../services/customerService.js";

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

//get available rooms
export const getAvailableHotelRooms = async (req, res) => {
  try {
    const rooms = await getAvailableHotelRoomsService(req.params.hotelId);

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

//get available room by id
export const getAvailableRoomById = async (req, res) => {
  try {
    const room = await getAvailableRoomByIdService(req.params.id);

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
