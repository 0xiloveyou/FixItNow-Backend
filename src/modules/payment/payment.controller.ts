import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";

const createPayment = catchAsync(
   async (req : Request,
          res : Response,
          next : NextFunction) => {

  
})


export const categoryController = {
  createPayment,

}