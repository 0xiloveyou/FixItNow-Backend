import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  paymentController.createPaymentIntent
);

router.post(
  "/webhook",
  paymentController.handleWebhook);

router.get(
  "/my",
  auth(Role.CUSTOMER),
  paymentController.getMyPayments);

router.get(
  "/:id",
  auth(Role.CUSTOMER),
  paymentController.getSinglePayment);

export const paymentRoutes = router;