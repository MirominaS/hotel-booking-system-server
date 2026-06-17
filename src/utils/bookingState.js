export const getBookingState = (booking) => {
  const now = new Date();

  if (booking.status === "confirmed" && now < booking.checkInDate) {
    return "upcoming";
  }

  if (
    booking.status === "confirmed" &&
    now >= booking.checkInDate &&
    now < booking.checkOutDate
  ) {
    return "active";
  }

  if (booking.status === "confirmed" && now > booking.checkOutDate) {
    return "checked-out";
  }

  return booking.status;
};
