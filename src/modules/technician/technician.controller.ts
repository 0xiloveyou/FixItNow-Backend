import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";
import { technicianSercive } from "./technician.service";

const createTechnicianProfile = catchAsync(
   async (req : Request,
          res : Response,
          next : NextFunction) => {

   const payload = req.body
   const id = req.user?.id
   const profile = await technicianSercive.createTechnicianProfileIntoDB(id as string, payload)

   sendResponse (res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "Thecnician Profile created sucessfully",
      data : {profile}
   })
})


const getMyProfile = catchAsync(
   async (req : Request,
          res : Response,
          next : NextFunction) => {

   const id = req.user?.id
   const profile = await technicianSercive.getMyProfileFormDB(id as string)

   sendResponse (res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "Thecnician Profile retrived sucessfully",
      data : {profile}
   })
})


export const technicianController = {
  createTechnicianProfile, 
  getMyProfile,     
}