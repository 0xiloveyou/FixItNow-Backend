import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router()
router.post(
    "/profile",
    auth(Role.ADMIN, Role.TECHNICIAN),
    technicianController.createTechnicianProfile)
router.get("/me", 
    auth(Role.ADMIN, Role.TECHNICIAN),
    technicianController.getMyProfile)


export const technicianRoutes = router