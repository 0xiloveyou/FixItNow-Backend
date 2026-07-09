import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"
import { IAvailabilityPayload, IUpdateAvailabilityPayload } from "./availability.interface";

const createAvailabilityIntoDB = async (
  userId: string,
  payload: IAvailabilityPayload
) => {
  const { date, startTime, endTime } = payload;

  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const isExist = await prisma.availability.findFirst({
    where: {
      technicianId: technician.id,
      date: new Date(date),
      startTime,
      endTime,
    },
  });

  if (isExist) {
    throw new Error("Availability already exists");
  }

  const availability = await prisma.availability.create({
    data: {
      technicianId: technician.id,
      date: new Date(date),
      startTime,
      endTime,
    },
  });

  return availability;
};


const getMyAvailabilityFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const availabilities = await prisma.availability.findMany({
    where: {
      technicianId: technician.id,
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  return availabilities;
};

const updateAvailabilityIntoDB = async (
  id: string,
  userId: string,
  payload: IUpdateAvailabilityPayload
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const availability = await prisma.availability.findUnique({
    where: {
      id,
    },
  });

  if (!availability) {
    throw new Error("Availability not found");
  }

  if (availability.technicianId !== technician.id) {
    throw new Error("You are not authorized to update this availability");
  }

  const updatedAvailability = await prisma.availability.update({
    where: {
      id,
    },
    data: {
      ...(payload.date && { date: new Date(payload.date) }),
      ...(payload.startTime && { startTime: payload.startTime }),
      ...(payload.endTime && { endTime: payload.endTime }),
      ...(payload.status && { status: payload.status }),
    },
  });

  return updatedAvailability;
};

export const availabilityService = {
  createAvailabilityIntoDB,
  getMyAvailabilityFromDB,
  updateAvailabilityIntoDB,

}