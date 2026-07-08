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

export const serviceService = {
  createServiceIntoDB,

}