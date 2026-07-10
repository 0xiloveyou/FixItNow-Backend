import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentIntent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const payload = req.body;

    const result = await paymentService.createPaymentIntentIntoDB(
      customerId,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment intent created successfully",
      data: result,
    });
  }
);


const handleWebhook = async (
  req: Request,
  res: Response
) => {
  const signature = req.headers["stripe-signature"] as string;

  await paymentService.handleWebhook(
    req.body,
    signature
  );

  res.status(200).json({
    received: true,
  });
};

export const paymentController = {
  createPaymentIntent,
  handleWebhook
};
