import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET ;

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        if (
            requestBody.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
            requestBody.password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        ) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }
        const token = jwt.sign(
            { role: "admin", email: requestBody.email },
            JWT_SECRET || "",
            { expiresIn: "1d" } 
        );

        const response = NextResponse.json(
            { success: true, message: "Login successful" },
            { status: 201 }
        );

        response.cookies.set("adminToken", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "strict", 
        });

        return response;
    } catch (error) {
        console.error("Error handling POST request:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
