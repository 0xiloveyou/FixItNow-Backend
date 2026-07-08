import { prisma } from "../../lib/prisma"
import { TechnicianProfilePayload, TechnicianProfileUpdatePayload } from "./technician.interface"

const  createTechnicianProfileIntoDB = async (Id : string, payload : TechnicianProfilePayload) => {
   const {bio, location, hourlyRate, experience}
   =  payload

   const isExist = await prisma.technicianProfile.findUnique({
     where: {
      userId: Id
    }
   })
   if(isExist){
     throw new Error("Technician profile already exist")
   }

   const profile = await prisma.technicianProfile.create({
      
      data : {
         userId : Id,
         bio ,
         location,
         hourlyRate, 
         experience
      }
   })

   return profile
}

const  getMyProfileFormDB = async (Id : string) => {

  //  console.log(Id)
   const isExist = await prisma.technicianProfile.findUnique({
     where: {
      userId : Id
    }
   })

   if(!isExist){
     throw new Error("Technician profile not found")
   }

   return isExist
}

const  updateProfileFormDB = async (Id : string, payload : TechnicianProfileUpdatePayload) => {

   const {bio, location, hourlyRate, experience}
   =  payload

   const isExist = await prisma.technicianProfile.findUnique({
     where: {
      userId : Id
    }
   })

   if(!isExist){
     throw new Error("Technician profile not found")
   }

   const update = await prisma.technicianProfile.update({
     where: {
      userId : Id
    },
    data : {
         bio ,
         location,
         hourlyRate, 
         experience
      }
   })

   return update
}


export const technicianSercive = {
  createTechnicianProfileIntoDB,
  getMyProfileFormDB,
  updateProfileFormDB
}