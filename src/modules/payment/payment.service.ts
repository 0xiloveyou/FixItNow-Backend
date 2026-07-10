import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { BookingStatus, PaymentProvider, PaymentStatus } from "../../../generated/prisma/enums";
import { ICreatePaymentPayload } from "./payment.interface";

const createPaymentIntentIntoDB = async (
  customerId: string,
  payload: ICreatePaymentPayload
) => {
  const { bookingId } = payload;

  // Find booking
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Check ownership
  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized");
  }

  // Only accepted bookings can be paid
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new Error("Booking is not ready for payment");
  }

  // Prevent duplicate payment
  const existingPayment = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingPayment) {
    throw new Error("Payment already exists for this booking");
  }

  // Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100),
    currency: "bdt",
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId,
    },
  });

  // Save payment
const payment = await prisma.payment.create({
  data: {
    bookingId: booking.id,
    transactionId: paymentIntent.id,
    provider: PaymentProvider.STRIPE,
    paymentMethod: "CARD",
    amount: booking.totalPrice,
    currency: "BDT",
    status: PaymentStatus.PENDING,
  },
});

  return {
    payment,
    clientSecret: paymentIntent.client_secret,
  };
};

export const paymentService = {
  createPaymentIntentIntoDB,
};