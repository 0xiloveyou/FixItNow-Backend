import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;

    const result = await reviewService.createReviewIntoDB(
      customerId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getTechnicianReviews = catchAsync(
  async (req: Request, res: Response) => {
    const { technicianId } = req.params;

    const result = await reviewService.getTechnicianReviewsFromDB(
      technicianId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician reviews retrieved successfully",
      data: result,
    });
  }
);


const deleteReview = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await reviewService.deleteReviewFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review deleted successfully",
      data: null,
    });
  }
);

export const reviewController = {
  createReview,
  getTechnicianReviews,
  deleteReview,
};
