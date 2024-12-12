import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
console.log(`HEYGEN_API_KEY IS ${HEYGEN_API_KEY}`)

export async function POST(req:NextRequest) {
  try {
    const body = await req.json();
    console.log('body:', body)
    console.log(`HEYGEN API KEY : ${HEYGEN_API_KEY}`)
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }
     const res = await fetch(
      "https://api.heygen.com/v1/streaming.create_token",
      {
        method: "POST",
        headers: {
          "x-api-key": HEYGEN_API_KEY,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to retrieve access token");
    }

    const data = await res.json();
    console.log(`${JSON.stringify(data)}`)
    const session =
       await prisma.session.create({
      data: {
          userId:body.userId,
      },
    })
    console.log('session:', session)
    console.log('token:', data.data.token)

    return NextResponse.json({ token:data.data.token, sessionId:session.id }, { status: 200 });
  } catch (error) {
    // Improved error logging
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    });

    // Return a more informative error response
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}