import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router()

router.get(
  "/users",
  auth(Role.ADMIN),
  adminController.getAllUsers)

router.get(
  "/users/:id",
  auth(Role.ADMIN),
  adminController.getSingleUser
)

export const adminRoutes = router