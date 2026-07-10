import express, { Application, NextFunction, request, Request, Response, Router } from "express";
import cors from "cors"
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { technicianRoutes } from "./modules/technician/technician.route";
import { categoryRoutes } from "./modules/category/category.route";
import { serviceRoutes } from "./modules/service/service.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { availabilityRoutes } from "./modules/availability/availability.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";


const app : Application = express()

app.use(cors({
   origin : config.app_url,
   credentials : true, // because of token and cokkie rretated stuff
}))


app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser()) /// if we don't use it then we don't get cookiee
                       /// we get undefined 
                      /// so use that middlewer 
                     /// else can't get 0 > req.cookies


app.get("/", async (req : Request, res: Response) => {
   // const user = await prisma.user.findMany()
   // console.log(user) // test 

   res.send("Welcome to Fix it Now.");
 })

app.use("/api/auth/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/technician", technicianRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/service", serviceRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/availability", availabilityRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);


app.use(notFound)
app.use(globalErrorHandler)

export default app;