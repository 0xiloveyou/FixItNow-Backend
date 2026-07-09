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

router.get(
  "/my",
  auth(Role.CUSTOMER),
  bookingController.getMyBookings)

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getSingleBooking
);

router.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  bookingController.cancelBooking
);



export const bookingRoutes = router