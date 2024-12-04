import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      console.log(body)
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });
  
      if(user?.filledApplication==true){
        return NextResponse.json({ message:"User already has a filled application",filled:true }, { status: 200 });
      }

      return NextResponse.json({ message:"User needs to fill the form",filled:false }, { status: 201 });
    } catch (error) {
  
      console.log(error)
      return NextResponse.json(
        { message: "Error fetching student", error: error },
        { status: 500 }
      );
    }
  }