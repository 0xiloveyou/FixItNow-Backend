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
  "/",
  auth(Role.ADMIN),
  bookingController.getAllBookings
);

router.get(
  "/technician",
  auth(Role.TECHNICIAN),
  bookingController.getTechnicianBookings
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

router.patch(
  "/:id/status",
  auth(Role.TECHNICIAN),
  bookingController.updateBookingStatus
);


export const bookingRoutes = router