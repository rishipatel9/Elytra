import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken")?.value;

    if (!adminToken) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      return NextResponse.redirect(new URL("/admin/login", baseUrl));
    }

    // Select meaningful fields for the frontend
    const programs = await prisma.program.findMany({
      select: {
        name: true,
        university: true,
        specialization: true,
        usp: true,
        ranking: true,
        location: true,
        eligibility: true,
        deposit: true, // Retaining this field in case it gets populated later
      },
    });

    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { message: "Error fetching programs", error: error },
      { status: 500 }
    );
  }
}
