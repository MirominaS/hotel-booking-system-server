import {
  createRoomTypeService,
  getHotelRoomTypesService,
  getRoomTypeByIdService,
  updateRoomTypeService,
  deleteRoomTypeService,
} from "../services/roomTypeService.js";

export const createRoomType = async (req, res) => {
  try {
    const roomType = await createRoomTypeService(
      req.user._id,
      req.params.hotelId,
      req.body,
    );

    res.status(201).json({
      success: true,
      roomType,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHotelRoomTypes = async (req, res) => {
  try {
    const roomTypes = await getHotelRoomTypesService(req.params.hotelId);

    res.status(200).json({
      success: true,
      roomTypes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRoomTypeById = async (req, res) => {
  try {
    const roomType = await getRoomTypeByIdService(req.params.id);

    res.status(200).json({
      success: true,
      roomType,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRoomType = async (req, res) => {
  try {
    const roomType = await updateRoomTypeService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      roomType,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRoomType = async (req, res) => {
  try {
    await deleteRoomTypeService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Room type deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
