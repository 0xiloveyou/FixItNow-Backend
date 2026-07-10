import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";


const createReviewIntoDB = async (
  customerId: string,
  payload: {
    bookingId: string;
    rating: number;
    comment?: string;
  }
) => {
  const { bookingId, rating, comment } = payload;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });


  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to review this booking.");
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("Only completed bookings can be reviewed.");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this booking.");
  }

  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId,
      technicianId: booking.technicianId,
      rating,
      comment,
    },
  });

  // Calculate technician average rating
  const reviewStats = await prisma.review.aggregate({
    where: {
      technicianId: booking.technicianId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  // Find technician profile
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId: booking.technicianId,
    },
  });

  if (technicianProfile) {
    await prisma.technicianProfile.update({
      where: {
        id: technicianProfile.id,
      },
      data: {
        averageRating: reviewStats._avg.rating ?? 0,
        completedJobs: reviewStats._count.rating,
      },
    });
  }

  return review;
};


const getTechnicianReviewsFromDB = async (technicianId: string) => {
  return prisma.review.findMany({
    where: {
      technicianId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      booking: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


const deleteReviewFromDB = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  // Recalculate technician rating
  const reviewStats = await prisma.review.aggregate({
    where: {
      technicianId: review.technicianId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId: review.technicianId,
    },
  });

  if (technicianProfile) {
    await prisma.technicianProfile.update({
      where: {
        id: technicianProfile.id,
      },
      data: {
        averageRating: reviewStats._avg.rating ?? 0,
        completedJobs: reviewStats._count.rating,
      },
    });
  }

  return null;
};

export const reviewService = {
  createReviewIntoDB,
  getTechnicianReviewsFromDB,
  deleteReviewFromDB,
};