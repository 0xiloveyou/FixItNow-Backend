import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"
import { RegisterUserPayload, UpdateUserProfilePayload } from "./user.interface"

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


const getUserProfileFromDB = async (userId : string) => {
   
   const isUserExist = await prisma.user.findUnique({
      where : {
         id : userId
      }
   })

   if(!isUserExist){
      throw new Error("User not found")
   }

   const user  = await prisma.user.findUnique({
      where : {
         id : userId
      },
      omit : {
         password : true
      }
   })

   return user
}



const updateMyProfileInDB = async (userId : string, payload : UpdateUserProfilePayload) => {
   const {name, phone, profileImage} =  payload

   // user exist or not --> auto handled by auth middleware
   const updatedUser = await prisma.user.update({
      where : {
         id : userId
      },
      data : {
         name ,
         phone,
         profileImage,
      },
      omit : {
         password : true
      },
   })
   return updatedUser
}

 
export const userService = {
   registerUserIntoDB,
   getUserProfileFromDB,
   updateMyProfileInDB,
}