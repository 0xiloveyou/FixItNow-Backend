import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { availabilityController } from "./availability.controller";

const router = Router()

router.post(
  "/",
  auth(Role.TECHNICIAN),
  availabilityController.createAvailability
)


router.get(
  "/me",
  auth(Role.TECHNICIAN),
  availabilityController.getMyAvailability
);

router.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  availabilityController.updateAvailability
);

router.delete(
  "/:id",
  auth(Role.TECHNICIAN),
  availabilityController.deleteAvailability
);

export const availabilityRoutes = router