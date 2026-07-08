import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { Role } from "../../../generated/prisma/enums"
import { ICategoryPayload } from "./category.interface"

const createCategoryIntoDB = async (payload : ICategoryPayload) => {

   const {name, icon, description} = payload

   const isCategoryExist = await prisma.category.findUnique({
      where : {name}
   })
   if(isCategoryExist){
      throw new Error("This category already exists")
   }

   const createdCategory = await prisma.category.create({
      data: {
         name,
         icon,
         description
      }
   })

   return createdCategory
}


// const getUserProfileFromDB = async (userId : string) => {
   
//    const isUserExist = await prisma.user.findUnique({
//       where : {
//          id : userId
//       }
//    })

//    if(!isUserExist){
//       throw new Error("User not found")
//    }

//    const user  = await prisma.user.findUnique({
//       where : {
//          id : userId
//       },
//       omit : {
//          password : true
//       }
//    })

//    return user
// }



// const updateMyProfileInDB = async (userId : string, payload : UpdateUserProfilePayload) => {
//    const {name, phone, profileImage} =  payload

//    // user exist or not --> auto handled by auth middleware
//    const updatedUser = await prisma.user.update({
//       where : {
//          id : userId
//       },
//       data : {
//          name ,
//          phone,
//          profileImage,
//       },
//       omit : {
//          password : true
//       },
//    })
//    return updatedUser
// }

 


export const categoryService = {
   createCategoryIntoDB
}