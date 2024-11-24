import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken")?.value;

    if(!adminToken) {
        return NextResponse.redirect(new URL("/admin/login"));
    }
    const programs = await prisma.program.findMany();
    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching students", error: error },
      { status: 500 }
    );
  }
}
