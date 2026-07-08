import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"

const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
}

export const adminService = {
  getAllUsersFromDB
}