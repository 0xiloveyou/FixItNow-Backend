import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";

declare global {
    namespace Express { 
        interface Request { /// insede Request body user property can have or be optional 
           user?: {
              email : string;
              name : string;
              id : string;
              role : Role; /// derect point form databse
           }
        }
    }
}


/// using rest operator
/// auth(Role.ADMIN, Role.USER, Role.AUTHOR)
/// converts to auth()=> ...requiredRole => [Role.ADMIN, Role.USER, Role.AUTHOR]

export const auth = (...requiredRoles : Role[]) => {
   return catchAsync (async ( /// returns a catch async fucntion 
       req : Request,        /// then returned fucntion will be auto called by the express
       res : Response, 
       next : NextFunction) => {
       
      //  const token = req.cookies.accessToken //! || // not handled propperly cause if found flase then no token actived . cause we used ||
      //!                 req.headers.authorization?.startsWith("Bearer ") ? 
      //                    req.headers.authorization?.split(" ")[1] :
                           // req.headers.authorization
                          // we can send token in 3 ways
                         // using cookies
                        // using bearer -> then we need to spit using space( ) 
                       // then take 1st indexJ
                     // else we can take direct autrhorztion from header

        const token = req.cookies.accessToken ? req.cookies.accessToken : 
                      req.headers.authorization?.startsWith("Bearer ") ? 
                      req.headers.authorization?.split(" ")[1] :
                      req.headers.authorization            

         if(!token){
            throw new Error("You are not logged in. Please log in to access this resouces")
         }

         const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret)
      
         if(!verifiedToken.success){
          throw new Error(verifiedToken.error)
         }

        const {email, name , id, role} = verifiedToken.data as JwtPayload

         // const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret)

         if(requiredRoles.length && !requiredRoles.includes(role)){
            throw new Error("Forbidden.You don't have permission to access this resource")
         }

         const user = await prisma.user.findUnique({
            where : {
               id, email, name, role
            }
         })

         if(!user){
            throw new Error("User not found.please log in again")
         }
         
         if(user.status === "BLOCKED"){
            throw new Error("Your account has been blocked. Please contact suport.")
         }

         req.user = {
            email, name, id, role
         }

         next()
      })

}