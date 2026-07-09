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
router.get(
  "/me",
  auth(Role.TECHNICIAN),
  serviceController.getMyServices
)
router.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  serviceController.updateService
)
router.delete(
  "/:id",
  auth(Role.TECHNICIAN, Role.ADMIN),
  serviceController.deleteService
)

router.get("/:id", serviceController.getSingleService)
router.get("/", serviceController.getAllServices);
 

export const serviceRoutes = router