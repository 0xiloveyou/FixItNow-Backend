import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllUsersFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: result,
    });
  }
);


export const adminController = {
  getAllUsers,

}