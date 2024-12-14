import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = req.headers.get("x-api-key"); // Retrieve the API key from the request headers

    console.log('body:', body);
    console.log(`Received API Key: ${apiKey}`);

    if (!apiKey) {
      throw new Error("API key is missing from the request headers");
    }

    const res = await fetch(
      "https://api.heygen.com/v1/streaming.create_token",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey, // Use the API key from headers
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to retrieve access token");
    }

    const data = await res.json();
    console.log(`${JSON.stringify(data)}`);
    
    const session = await prisma.session.create({
      data: {
        userId: body.userId,
      },
    });

    console.log('session:', session);
    console.log('token:', data.data.token);

    return NextResponse.json({ token: data.data.token, sessionId: session.id }, { status: 200 });
  } catch (error) {
    // Improved error logging
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
    });

    // Return a more informative error response
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }, { status: 500 });
  }
}
