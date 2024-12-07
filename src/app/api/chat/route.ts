import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function POST(req: NextRequest) {
  try {
    const { message, contexts, metadata } = await req.json();

    if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Construct prompt with context and search metadata
    const prompt = `
You are an expert educational consultant at Elytra, specializing in program recommendations. 
I have found ${metadata?.totalResults || 'several'} programs that might be relevant to the user's query.

Here are the detailed program descriptions:
${contexts.join('\n---\n')}

User Query: ${message}

Based on these programs and the user's query, please provide a response that:
1. Directly addresses the user's specific question or need
2. References the most relevant programs from our database, mentioning them by name
3. Highlights key features that match the user's interests (fees, duration, location, etc.)
4. Explains why these programs would be good choices
5. Suggests next steps (like application requirements or deadlines)
6. If relevant, mentions any unique aspects like internship opportunities or specializations
7. Organizes information in clear sections
8. Uses bullet points for lists
9. Highlights key details in bold

Remember to:
- Be specific when referencing programs and their features
- Maintain a professional yet friendly tone
- Acknowledge if some information is not available
- Suggest alternatives if the exact match isn't available
- Encourage the user to ask follow-up questions about specific programs

Response:`;

    const result = await model.generateContentStream(prompt);
    
    // Create a readable stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: { 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Streaming Error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
