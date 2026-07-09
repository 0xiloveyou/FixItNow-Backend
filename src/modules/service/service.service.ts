import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"
import { IServicePayload } from "./service.interface"
import { Prisma } from "../../../generated/prisma/browser"

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

  const existingService = await prisma.service.findFirst({
  where: {
    technicianId: technicianProfile.id,
    categoryId,
  },
});

if (existingService) {
  throw new Error(
    "You have already created a service for this category."
  );
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


const getAllServicesFromDB = async (query: Record<string, any>) => {
  const { searchTerm, ...filterData } = query;

  const andConditions: Prisma.ServiceWhereInput[] = [];

  // Search
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Category filter
  if (filterData.category) {
    andConditions.push({
      category: {
        name: {
          equals: filterData.category,
          mode: "insensitive",
        },
      },
    });
  }

  // Location filter
  if (filterData.location) {
    andConditions.push({
      technician: {
        location: {
          contains: filterData.location,
          mode: "insensitive",
        },
      },
    });
  }

  // Rating filter
  if (filterData.rating) {
    andConditions.push({
      technician: {
        averageRating: {
          gte: Number(filterData.rating),
        },
      },
    });
  }

  // Price filter
  if (filterData.priceMin || filterData.priceMax) {
    andConditions.push({
      price: {
        gte: filterData.priceMin
          ? Number(filterData.priceMin)
          : undefined,
        lte: filterData.priceMax
          ? Number(filterData.priceMax)
          : undefined,
      },
    });
  }

  // Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const data = await prisma.service.findMany({
    where: whereConditions,
    include: {
      category: true,
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.service.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};


const getMyServicesFromDB = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!technician) {
    throw new Error("Technician profile not found");
  }

  const services = await prisma.service.findMany({
    where: {
      technicianId: technician.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return services;
};

export const serviceService = {
  createServiceIntoDB,
  updateServiceIntoDB,
  deleteServiceFromDB,
  getSingleServiceFromDB,
  getAllServicesFromDB,
  getMyServicesFromDB,
}
