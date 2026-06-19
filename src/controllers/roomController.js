import {
  createRoomService,
  getHotelRoomService,
  getRoomByIdService,
  updateRoomService,
  deleteRoomService,
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

export const updateRoom = async (req, res) => {
  try {
    const room = await updateRoomService(
      req.user.id,
      req.params.hotelId,
      req.params.roomId,
      req.body,
    );

    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    await deleteRoomService(req.user.id, req.params.hotelId, req.params.roomId);

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
