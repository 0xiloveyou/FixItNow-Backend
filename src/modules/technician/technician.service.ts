import { prisma } from "../../lib/prisma"
import { TechnicianProfilePayload } from "./technician.interface"

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


export const technicianSercive = {
  createTechnicianProfileIntoDB,

}