import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"
import { IUpdateUserStatusPayload } from "./admin.interface"

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

const getSingleUserFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
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

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserStatusIntoDB = async (
  id: string,
  payload: IUpdateUserStatusPayload
) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
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

  return updatedUser;
};

export const adminService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserStatusIntoDB,

}