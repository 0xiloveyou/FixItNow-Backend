import express, { Application, NextFunction, request, Request, Response, Router } from "express";
import cors from "cors"
import config from "./config";
// import { userRoutes } from "./modules/user/user.route";
// import { authRoutes } from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
// import { postRoutes } from "./modules/post/post.route";
// import { commentRoutes } from "./modules/comment/comment.route";
// import { notFound } from "./middlewares/notFound";
// import httpStatus from "http-status"
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
// import { subscriptionRoutes } from "./modules/subscription/subscription.route";
// import { stripe } from "./lib/stripe";
// import { premiumRoutes } from "./modules/premium/premium.route";


const app : Application = express()

app.use(cors({
   origin : config.app_url,
   credentials : true, // because of token and cokkie rretated stuff
}))


// const endpointSecret = config.stripe_webhook_secret
      
/// keep this api endpoin before --> express.json() middlewere
// app.post("/api/subscription/webhook", 
//     express.raw({ type : 'application/json'}),
//     (request, response) => {

//   let event = request.body;
//   console.log(event, "stripe request body")
//   console.log(request.headers, "stripe req heareds")

  
//   if (endpointSecret) {
    
//     const signature = request.headers['stripe-signature']!;
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature,
//         endpointSecret
//       );
//     } catch (err : any) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.status(400).json({
//          message : err.message
//       })
//     }
//   }

//   console.log(event, "event after try block")

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
//  }
// )


// app.use("/api/subscription/webhook", 
//         express.raw({ type : 'application/json'}))
/// here is no controller 
// it match the route then goto last route then call the controller

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser()) /// if we don't use it then we don't get cookiee
                       /// we get undefined 
                       /// so use that middlewer 
                       /// else cn't get 0> req.cookies


app.get("/", async (req : Request, res: Response) => {
   // const user = await prisma.user.findMany()
   // console.log(user) // test 

   res.send("Hello, world!");
 })

app.use("/api/user", userRoutes)
// app.use("/api/auth", authRoutes)
// app.use("/api/posts", postRoutes)
// app.use("/api/comments", commentRoutes)
// app.use("/api/subscription", subscriptionRoutes)
// app.use("/api/premium", premiumRoutes)

// /// sometimes we hit unknown url
// /*
// like : /api/ksladjf

// in that case compile try to match the end point 

// if no one match then at last 
// it enters the 
// last --> app.use()

// then show the response
// */
// app.use(notFound)


// /// all 4 paramiter is must 
// // first err & last next 
app.use(globalErrorHandler)

export default app;