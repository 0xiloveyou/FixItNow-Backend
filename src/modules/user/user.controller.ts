import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";
import { userService } from "./user.service";
 
const registerUser = catchAsync(
   async (req : Request,
          res : Response,
          next : NextFunction) => {
   const payload = req.body
   const user = await userService.registerUserIntoDB(payload)


   sendResponse (res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "User registered sucessfully",
      data : {user}
   })
})


const getMyProfile = catchAsync(
   async (req : Request,
          res : Response,
          next : NextFunction) => {

   
   const user = await userService.getUserProfileFromDB(req.user?.id as string)
   sendResponse (res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "User profile retrive sucessfully",
      data : {user}
   })
})


const updateMyProfile = catchAsync( async (req : Request, res : Response, next : NextFunction) => {
   
   const userId = req.user?.id as string
   const payload= req.body
   
   const updatedProfile = await userService.updateMyProfileInDB(userId, payload)

   sendResponse(res, {
      success : true,
      statusCode : httpStatus.OK,
      message : "user profile updated successfully",
      data : {updatedProfile} 
   })
})



export const userController = {
   registerUser,
   getMyProfile,
   updateMyProfile,
}