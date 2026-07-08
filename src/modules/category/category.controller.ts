import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { NextFunction, Request, Response} from "express";
import { categoryService } from "./category.service";

const createCategory = catchAsync(
   async (req : Request,
          res : Response,
          next : NextFunction) => {

   const payload = req.body
   const category = await categoryService.createCategoryIntoDB(payload)

   sendResponse (res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "Category created sucessfully",
      data : {category}
   })
})


const updateCategory = catchAsync(
  async (
    req: Request,
     res: Response
  ) => {

    const { id } = req.params;
    const payload = req.body;

    const category = await categoryService.updateCategoryIntoDB(id as string, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: category,
    })
  }
)


// const getMyProfile = catchAsync(
//    async (req : Request,
//           res : Response,
//           next : NextFunction) => {

   
//    const user = await userService.getUserProfileFromDB(req.user?.id as string)
//    sendResponse (res, {
//       success : true,
//       statusCode : httpStatus.CREATED,
//       message : "User profile retrive sucessfully",
//       data : {user}
//    })
// })


// const updateMyProfile = catchAsync( async (req : Request, res : Response, next : NextFunction) => {
   
//    const userId = req.user?.id as string
//    const payload= req.body
   
//    const updatedProfile = await userService.updateMyProfileInDB(userId, payload)

//    sendResponse(res, {
//       success : true,
//       statusCode : httpStatus.OK,
//       message : "user profile updated successfully",
//       data : {updatedProfile} 
//    })
// })


export const categoryController = {
  createCategory,
  updateCategory
}