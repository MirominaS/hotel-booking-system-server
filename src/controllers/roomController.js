import {
  createRoomService,
  getHotelRoomService,
  getRoomByIdService,
} from "../services/roomService.js";

export const createRoom = async (req, res) => {
  try {
    const room = await createRoomService(
      req.user._id,
      req.params.hotelId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Room created successfully.",
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHotelRooms = async (req, res) => {
  try {
    const rooms = await getHotelRoomService(req.params.hotelId);

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

export const getRoomById = async (req, res) => {
  try {
    const room = await getRoomByIdService(req.params.id);

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
