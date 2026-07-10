import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import { ICreatePaymentPayload } from "./payment.interface";
import {
  handlePaymentFailed,
  handlePaymentSucceeded,
} from "../../utils/payment.utils";

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

  // Check existing payment
  const existingPayment = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });

  // Already paid
  if (
    existingPayment &&
    existingPayment.status === PaymentStatus.COMPLETED
  ) {
    throw new Error("This booking has already been paid.");
  }

  // Create new Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100),
    currency: "bdt",
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId,
    },
  });

  // Update existing pending payment
  if (existingPayment) {
    await prisma.payment.update({
      where: {
        bookingId,
      },
      data: {
        transactionId: paymentIntent.id,
        provider: PaymentProvider.STRIPE,
        paymentMethod: "CARD",
        amount: booking.totalPrice,
        currency: "BDT",
        status: PaymentStatus.PENDING,
      },
    });
  } else {
    // Create new payment
    await prisma.payment.create({
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
  }

  const payment = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });

  return {
    payment,
    clientSecret: paymentIntent.client_secret,
  };
};

const handleWebhook = async (
  payload: Buffer,
  signature: string
) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }
};

const getMyPaymentsFromDB = async (customerId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId,
      },
    },
    include: {
      booking: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};


const getSinglePaymentFromDB = async (
  customerId: string,
  paymentId: string
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      booking: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.booking.customerId !== customerId) {
    throw new Error("You are not authorized");
  }

  return payment;
};

const createCheckoutSessionIntoDB = async (
  customerId: string,
  payload: ICreatePaymentPayload
) => {
  const { bookingId } = payload;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized");
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new Error("Booking is not ready for payment");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      bookingId,
    },
  });

  if (
    existingPayment &&
    existingPayment.status === PaymentStatus.COMPLETED
  ) {
    throw new Error("Booking already paid.");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: booking.service.title,
            description: booking.service.description,
          },
          unit_amount: Math.round(booking.totalPrice * 100),
        },
        quantity: 1,
      },
    ],

    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId,
    },

    success_url: `${config.app_url}/payment-success`,
    cancel_url: `${config.app_url}/payment-cancel`,
  });

  if (existingPayment) {
    await prisma.payment.update({
      where: {
        id: existingPayment.id,
      },
      data: {
        // Save Checkout Session ID for now
        transactionId: session.id,
        provider: PaymentProvider.STRIPE,
        paymentMethod: "CARD",
        amount: booking.totalPrice,
        currency: "BDT",
        status: PaymentStatus.PENDING,
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        // Save Checkout Session ID for now
        transactionId: session.id,
        provider: PaymentProvider.STRIPE,
        paymentMethod: "CARD",
        amount: booking.totalPrice,
        currency: "BDT",
        status: PaymentStatus.PENDING,
      },
    });
  }

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};


export const paymentService = {
  createPaymentIntentIntoDB,
  handleWebhook,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
  createCheckoutSessionIntoDB
};