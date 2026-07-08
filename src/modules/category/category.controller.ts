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

const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {

    const { id } = req.params

    await categoryService.deleteCategoryFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully",
      data: null,
    })
  }
)


const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    })
  }
)


const getSingleCategory = catchAsync(
  async (req: Request, res: Response) => {

    const { id } = req.params

    const result = await categoryService.getSingleCategoryFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category retrieved successfully",
      data: result,
    })
  }
)

export const categoryController = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,

}