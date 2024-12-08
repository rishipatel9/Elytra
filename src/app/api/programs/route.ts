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

    const programs = await prisma.program.findMany();

    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { message: "Error fetching programs", error: error },
      { status: 500 }
    );
  }
}
