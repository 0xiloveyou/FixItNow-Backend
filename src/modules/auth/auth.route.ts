import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router()
router.post("/login", authController.loginUser)
router.post("/refresh-token", authController.refreshToken) // public api 

/// why we don't use access token and auth middlewere to generate new access token 
/*
cause even though we store the expired access token in local storage 
after entering the auth middlewer we will stuck insde if block which thorugh the error
*/

export const authRoutes = router