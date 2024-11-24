import { User } from "./auth";
import prisma from "./prisma";

export const createUser=async (user:User)=>{
    try{
        const ifUsrExists = await prisma.studentInformation.findUnique({
            where:{
                email:user.email
            }
        })
        if(ifUsrExists){
            return
        }


        // await prisma.studentInformation.create({
        //     data:{

        //     }
        // })
    }
    catch(e){
        console.log(e)
    }   
}
