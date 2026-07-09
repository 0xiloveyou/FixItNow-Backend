import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";
import { serviceService } from "./service.service";

const createService = catchAsync(
  async (req: Request, res: Response) => {
    
    const payload = req.body;
    const userId = req.user?.id as string;

    const result = await serviceService.createServiceIntoDB(
      userId,
      payload
    )

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service created successfully",
      data: result,
    })
  }
)

const updateService = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id as string;

    const result = await serviceService.updateServiceIntoDB(
      id as string,
      userId,
      req.body
    )

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service updated successfully",
      data: result,
    })
  }
)


const deleteService = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id as string;

    await serviceService.deleteServiceFromDB(id as string, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service deleted successfully",
      data: null,
    })
  }
)

const getSingleService = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await serviceService.getSingleServiceFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service retrieved successfully",
      data: result,
    });
  }
);


const getAllServices = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const query = req.query;

    const result = await serviceService.getAllServicesFromDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);


export const serviceController = {
  createService,
  updateService,
  deleteService,
  getSingleService,
  getAllServices
}