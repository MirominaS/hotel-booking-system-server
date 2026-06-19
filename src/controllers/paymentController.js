import {
  createBookingCheckoutService,
  bookingPaymentSuccessService,
  getOwnerPaymentsService,
} from "../services/paymentService.js";

export const createBookingCheckout = async (req, res) => {
  try {
    const { bookingReference } = req.body;

    const session = await createBookingCheckoutService(
      req.user,
      bookingReference,
    );

    res.status(200).json({
      success: true,
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const payment = await bookingPaymentSuccessService(sessionId, req.user._id);

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerPayments = async (req, res) => {
  try {
    const payments = await getOwnerPaymentsService(req.user._id);

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
