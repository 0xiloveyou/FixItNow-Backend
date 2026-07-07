import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"
import { RegisterUserPayload } from "./user.interface"

const registerUserIntoDB = async (payload : RegisterUserPayload) => {

   const {name, email, password, profileImage, role, phone} = payload

   const isUserExist = await prisma.user.findUnique({
      where : {email}
   })
   if(isUserExist){
      throw new Error("User with this email already exists")
   }
   if(role === Role.ADMIN){
      throw new Error("you can't crate admin profile without admins approval. you can conrtact with admin.")
   }

   const hashedPassword = await bcrypt.hash(
      password, 
      Number(config.bcrypt_salt_rounds)
   )

   const createdUser = await prisma.user.create({
      data: {
         name,
         email, 
         password : hashedPassword,
         profileImage,
         role,
         phone
      }
   })

   const user  = await prisma.user.findUnique({
      where : {
         id : createdUser.id,
         email : createdUser.email || email
      },
      omit : {
         password : true
      }
   })
   return user
}
 
export const userService = {
   registerUserIntoDB,

}