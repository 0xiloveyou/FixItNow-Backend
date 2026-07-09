import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"
import { IServicePayload } from "./service.interface"

const createServiceIntoDB = async (
  userId: string,
  payload: IServicePayload
) => {
  const { categoryId, title, description, price, duration } = payload

  
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technicianProfile) {
    throw new Error("Technician profile not found");
  }


  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  })

  if (!category) {
    throw new Error("Category not found");
  }


  const service = await prisma.service.create({
    data: {
      technicianId: technicianProfile.id,
      categoryId,
      title,
      description,
      price,
      duration,
    },
  })

  return service
}

const updateServiceIntoDB = async (
  serviceId: string,
  userId: string,
  payload: Partial<IServicePayload>
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  })

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  })

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.technicianId !== technician.id) {
    throw new Error("You are not authorized to update this service");
  }

  return await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: payload,
  })
}


const deleteServiceFromDB = async (
  serviceId: string,
  userId: string
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  })

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  })

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.technicianId !== technician.id) {
    throw new Error("You are not authorized to delete this service");
  }

  await prisma.service.delete({
    where: {
      id: serviceId,
    },
  })

  return null
}

const getSingleServiceFromDB = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              // email: true,
              phone: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

export const serviceService = {
  createServiceIntoDB,
  updateServiceIntoDB,
  deleteServiceFromDB,
  getSingleServiceFromDB,
}