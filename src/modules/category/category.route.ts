import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router()

router.post(
    "/", 
    auth(Role.ADMIN),
    categoryController.createCategory)

router.patch(
  "/:id",
  auth(Role.ADMIN),
  categoryController.updateCategory)

router.delete(
  "/:id",
  auth(Role.ADMIN),
  categoryController.deleteCategory
)
router.get(
  "/", 
  categoryController.getAllCategories)

router.get(
  "/:id",
  categoryController.getSingleCategory)

export const categoryRoutes = router