import { IBookingPayload } from "./booking.interface";
import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { AvailabilityStatus, BookingStatus, Role } from "../../../generated/prisma/enums"


const createBookingIntoDB = async (
  customerId: string,
  payload: IBookingPayload
) => {
  const { serviceId, slotId, address, note } = payload;

  // Check service
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  // Get technician profile
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      id: service.technicianId,
    },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found");
  }

  // Check availability slot
  const slot = await prisma.availability.findUnique({
    where: {
      id: slotId,
    },
  });

  if (!slot) {
    throw new Error("Availability slot not found");
  }

  // Ensure the slot belongs to this technician
  if (slot.technicianId !== technicianProfile.id) {
    throw new Error("Invalid availability slot");
  }

  // Check slot status
  if (slot.status !== AvailabilityStatus.AVAILABLE) {
    throw new Error("This availability slot is not available");
  }

const booking = await prisma.booking.create({
  data: {
    customerId,
    technicianId: technicianProfile.userId,
    serviceId,
    slotId,
    address,
    note,
    totalPrice: service.price,
    status: BookingStatus.REQUESTED,
  },
  include: {
    customer: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
      },
    },
    technician: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
      },
    },
    service: true,
    slot: true,
  },
});
  // Reserve the slot
  await prisma.availability.update({
    where: {
      id: slotId,
    },
    data: {
      status: AvailabilityStatus.RESERVED,
    },
  });

  return booking;
};

const getMyBookingsFromDB = async (customerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      customerId,
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      service: {
        include: {
          category: true,
        },
      },
      slot: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const getSingleBookingFromDB = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      service: {
        include: {
          category: true,
        },
      },
      slot: true,
      payment: true,
      review: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

const cancelBookingIntoDB = async (
  bookingId: string,
  customerId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      slot: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to cancel this booking");
  }

  if (
    booking.status === BookingStatus.IN_PROGRESS ||
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new Error("This booking cannot be cancelled");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
      include: {
        service: true,
        slot: true,
      },
    });

    await tx.availability.update({
      where: {
        id: booking.slotId,
      },
      data: {
        status: AvailabilityStatus.AVAILABLE,
      },
    });

    return updatedBooking;
  });

  return result;
};

const getAllBookingsFromDB = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
          role: true,
        },
      },
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
          role: true,
        },
      },
      service: {
        include: {
          category: true,
        },
      },
      slot: true,
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

export const bookingService = {
  createBookingIntoDB,
  getMyBookingsFromDB,
  getSingleBookingFromDB,
  cancelBookingIntoDB,
  getAllBookingsFromDB,
};