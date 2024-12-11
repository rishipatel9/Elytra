import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

let programsCached: any[] = [];
let cacheTimestamp: number | null = null;
const CACHE_TTL = 5 * 60 * 1000; 

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken")?.value;
    if (!adminToken) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      return NextResponse.redirect(new URL("/admin/login", baseUrl));
    }
    // if (programsCached.length > 0 && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL) {
    //   return NextResponse.json({ programs: programsCached }, { status: 200 });
    // }
    const programs = await prisma.program.findMany();
    
    programsCached = programs;
    cacheTimestamp = Date.now(); 

    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { message: "Error fetching programs", error: error },
      { status: 500 }
    );
  }
}
