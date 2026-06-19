import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import stripe from "../config/stripe.js";
import Hotel from "../models/Hotel.js";

export const createBookingCheckoutService = async (user, bookingReference) => {
  const bookings = await Booking.find({
    customer: user._id,
    bookingReference,
  });

  if (!bookings.length) {
    throw new Error("Booking not found");
  }

  const amount = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Hotel Booking ${bookingReference}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],

    metadata: {
      bookingReference,
    },

    return_url:
      "http://localhost:5173/booking-success?session_id={CHECKOUT_SESSION_ID}",
  });

  const payment = await Payment.create({
    bookingReference,
    customer: user._id,
    stripeSessionId: session.id,
    amount,
    paymentStatus: "pending",
    customerEmail: user.email,
  });

  await Booking.updateMany(
    {
      bookingReference,
    },
    {
      payment: payment._id,
    },
  );

  return session;
};

export const bookingPaymentSuccessService = async (sessionId, userId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const payment = await Payment.findOne({
    stripeSessionId: sessionId,
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Security check
  if (payment.customer.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  // Prevent double processing
  if (payment.status === "paid") {
    return payment;
  }

  const booking = await Booking.findOne({
    bookingReference: payment.bookingReference,
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (
    booking.status === "cancelled" ||
    (booking.holdExpiresAt && booking.holdExpiresAt < new Date())
  ) {
    throw new Error("Booking hold has expired");
  }

  payment.status = "paid";
  await payment.save();

  await Booking.updateMany(
    {
      bookingReference: payment.bookingReference,
      status: "pending",
    },
    {
      status: "confirmed",
      holdExpiresAt: null,
    },
  );

  return payment;
};

export const getOwnerPaymentsService = async (userId) => {
  const hotels = await Hotel.find({
    user: userId,
  }).select("_id");

  const hotelIds = hotels.map((hotel) => hotel._id);

  const bookings = await Booking.find({
    hotel: {
      $in: hotelIds,
    },
    payment: {
      $ne: null,
    },
  }).select("payment");

  const paymentIds = [...new Set(bookings.map((b) => b.payment.toString()))];

  return await Payment.find({
    _id: {
      $in: paymentIds,
    },
  })
    .populate("customer", "firstName lastName email")
    .sort({
      createdAt: -1,
    });
};
