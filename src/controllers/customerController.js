import {
  getApprovedHotelsService,
  getApprovedHotelByIdService,
  getAvailableHotelRoomsService,
  getAvailableRoomByIdService,
  searchHotelsService,
} from "../services/customerService.js";

//get approved hotels
export const getApprovedHotels = async (req, res) => {
  try {
    // pagination query
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    // validate pagination values
    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    // skip
    const skip = (page - 1) * limit;

    // filters
    const status = req.query.status || "";
    const search = req.query.search || "";

    const results = await getApprovedHotelsService(
      page,
      limit,
      skip,
      status,
      search,
    );

    res.status(200).json({
      success: true,
      ...results,
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
  console.log("ROOM ROUTE HIT");
  try {
    const pageRaw = Number(req.query.page ?? 1);
    const limitRaw = Number(req.query.limit ?? 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;

    const skip = (page - 1) * limit;

    const result = await getAvailableHotelRoomsService(
      req.params.hotelId,
      page,
      limit,
      skip,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.log("ROOM ERROR =", error.message);
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

export const searchHotels = async (req, res) => {
  try {
    const { city, checkIn, checkOut, guests } = req.query;

    console.log({
      city,
      checkIn,
      checkOut,
      guests,
    });

    const hotels = await searchHotelsService({
      city,
      checkIn,
      checkOut,
      guests: Number(guests),
    });

    res.json({
      success: true,
      hotels,
    });
  } catch (error) {
    console.log("SEARCH ERROR =", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
