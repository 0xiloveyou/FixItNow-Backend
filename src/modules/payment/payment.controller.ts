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

const getMyPayments = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;

    const result = await paymentService.getMyPaymentsFromDB(customerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My payments retrieved successfully",
      data: result,
    });
  }
);


const getSinglePayment = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;
    const paymentId = req.params.id;

    const result = await paymentService.getSinglePaymentFromDB(
      customerId,
      paymentId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });
  }
);


const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user?.id as string;
    const payload = req.body;

    const result = await paymentService.createCheckoutSessionIntoDB(
      customerId,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Checkout session created successfully",
      data: result,
    });
  }
);

export const paymentController = {
  createPaymentIntent,
  handleWebhook,
  getMyPayments,
  getSinglePayment,
  createCheckoutSession
};
