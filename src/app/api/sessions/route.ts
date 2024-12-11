import prisma from "@/lib/prisma";
import { getUserDetails } from "@/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getUserDetails();

    // if (!session) {
    //   return NextResponse.json({ success: false, error: "No session found" });
    // }

    const userSessions = await prisma.session.findMany({
      where: {
        userId: session.user.id, 
      },
      select: {
        id: true,
        summary: true,
        createdAt: true,
        chats: {
          select: {
            id: true,
            message: true,
            sender: true,
            createdAt: true,
          },
        },
      },
    });
    console.log(userSessions)

    return NextResponse.json({ success: true, data: userSessions });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user sessions" });
  } finally {
    await prisma.$disconnect();
  }
}
