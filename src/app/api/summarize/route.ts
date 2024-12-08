import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/GeminiClient";
import prisma from "@/lib/prisma";

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { message: "sessionId is required" },
        { status: 400 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" }, 
    });

    if (!chats.length) {
      return NextResponse.json(
        { message: "No chats found for this sessionId" },
        { status: 404 }
      );
    }

    const chatContent = chats
      .map((chat) => `${chat.sender}: ${chat.message}`)
      .join("\n");

    const prompt = `
    You are an expert summarizer. Given a conversation between a user and an AI assistant, create a concise summary that highlights the main points of the discussion.

    Here is the chat conversation:
    ${chatContent}

    Summary:
        `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text(); 

    const session = await prisma.session.update({
        where: { id: sessionId },
        data: { summary },
    });
    console.log("session",session)

    return NextResponse.json(
      {
        message: "Chat summary generated successfully",
        summary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating chat summary:", error);
    return NextResponse.json(
      { message: "Error summarizing the chat", error: error },
      { status: 500 }
    );
  }
}
