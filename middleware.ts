import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-secret";

export function middleware(req: NextRequest) {
    const adminToken = req.cookies.get("adminToken")?.value;
    if (!adminToken) {
        return NextResponse.redirect(new URL("/signup", req.url));
    }
    try {
        const decoded = jwt.verify(adminToken, JWT_SECRET) as unknown as { role: string };
        if (decoded.role !== "admin") {
            return NextResponse.redirect(new URL("/signup", req.url));
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.redirect(new URL("/signup", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
