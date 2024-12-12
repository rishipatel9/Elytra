import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Clear the "adminToken" cookie
        const response = NextResponse.json(
            { success: true, message: "Logout successful" },
            { status: 200 }
        );

        response.cookies.set("adminToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(0), 
            sameSite: "strict",
        });
        response.cookies.delete("adminToken");

        const redirectResponse = NextResponse.redirect(new URL("/auth/signin", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
        return redirectResponse;

    } catch (error) {
        console.error("Error handling logout:", error);
        return NextResponse.json(
            { error: "Failed to process logout" },
            { status: 500 }
        );
    }
}
