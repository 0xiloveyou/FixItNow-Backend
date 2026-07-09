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



const getMyBookings = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    const result = await bookingService.getMyBookingsFromDB(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My bookings retrieved successfully",
      data: result,
    });
  }
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await bookingService.getSingleBookingFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking retrieved successfully",
      data: result,
    });
  }
);

const cancelBooking = catchAsync(
  async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const customerId = req.user?.id as string;

    const result = await bookingService.cancelBookingIntoDB(
      bookingId as string,
      customerId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking cancelled successfully",
      data: result,
    });
  }
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response) => {
    const result = await bookingService.getAllBookingsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });
  }
);

export const bookingController = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
  getAllBookings,
};