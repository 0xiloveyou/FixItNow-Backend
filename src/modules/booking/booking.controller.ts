import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";
import { bookingService } from "./booking.service";


const createBooking = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    const result = await bookingService.createBookingIntoDB(
      customerId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  }
);

export const bookingController = {
  createBooking,
};