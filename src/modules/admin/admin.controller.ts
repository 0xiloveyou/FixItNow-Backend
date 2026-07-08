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

const getSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.getSingleUserFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: result,
    });
  }
);


const updateUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.updateUserStatusIntoDB(
      id as string,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  }
);

export const adminController = {
  getAllUsers,
  getSingleUser,
  updateUserStatus,
}