import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router()

router.post(
  "/",
  auth(Role.TECHNICIAN),
  serviceController.createService
)

export const serviceRoutes = router