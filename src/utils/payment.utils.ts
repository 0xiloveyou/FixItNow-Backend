import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { BookingStatus, PaymentStatus } from "../../generated/prisma/enums";

export const handlePaymentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const transactionId = paymentIntent.id;

  const payment = await prisma.payment.findFirst({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    console.log(`Webhook: Payment not found for ${transactionId}`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    await tx.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: BookingStatus.PAID,
      },
    });
  });
};

export const handlePaymentFailed = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const transactionId = paymentIntent.id;

  const payment = await prisma.payment.findFirst({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    console.log(`Webhook: Payment not found for ${transactionId}`);
    return;
  }

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });
};