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

export const serviceController = {
  createService
}