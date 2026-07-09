import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";
import { availabilityService } from "./availability.service";

const createAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await availabilityService.createAvailabilityIntoDB(
      userId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Availability created successfully",
      data: result,
    });
  }
);


const getMyAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await availabilityService.getMyAvailabilityFromDB(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability retrieved successfully",
      data: result,
    });
  }
);

export const availabilityController = {
  createAvailability,
  getMyAvailability,
  
}


