import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router()

router.post(
  "/",
  auth(Role.CUSTOMER),
  bookingController.createBooking
);

export const bookingRoutes = router