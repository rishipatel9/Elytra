import { getStudentById } from "@/helper";
import OpenAI from "openai";

export class OpenAIAssistant {
  private client: OpenAI;
  private conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

  constructor(private userId: string) {
    this.client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
      dangerouslyAllowBrowser: true,
    });
  }

  async initialize() {
    // Fetch student details during initialization
    let studentDetails = "";
    try {
      const res = await getStudentById(this.userId);
      studentDetails = JSON.stringify(res, null, 2); // Format details for readability
    } catch (error) {
      console.error("Error fetching student details for system prompt:", error);
      studentDetails = "No additional context is available for this student.";
    }

    // Initialize system message with student details
  this.conversationHistory.push({
  role: "system",
  content: `
    You are an exceptional International Career Counsellor, dedicated to providing highly personalized and impactful guidance to students. Your mission is to help them make the best possible decision for their future—a decision that is not only wise and practical but also deeply considerate of their aspirations, financial investment, and long-term goals.

    Students rely on you as a trusted guardian angel for advice on critical career choices. Your role requires authenticity, empathy, and a deep understanding of what is genuinely in their best interest:
    - Provide clear, concise, and actionable answers (preferably in 3 bullet points).
    - Maintain a polite tone, even when delivering hard truths. Always prioritize honesty over false reassurance.
    - Cite resources or provide links to important references only if they are highly reliable and relevant.

    Be precise, insightful, and impactful. Always aim to provide answers that students can trust and act upon confidently.

    For context, here is detailed information about the student:
    ${studentDetails}
  `,
});

    return this;
  }

  async getResponse(userMessage: string): Promise<string> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      // Trim conversation history if it gets too long
      if (this.conversationHistory.length > 6) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-5), // Keep last 5 interactions
        ];
      }

      console.log(`conversationHistory is ${JSON.stringify(this.conversationHistory)}`);

      const completion = await this.client.chat.completions.create({
        messages: this.conversationHistory,
        model: "llama-3.3-70b-versatile", // Ensure this matches Groq's available models
        max_tokens: 300,
        temperature: 0.7,
      });

      const responseText =
        completion.choices[0]?.message?.content || "Sorry, I couldn't process your request.";

      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: "assistant",
        content: responseText,
      });

      return responseText;
    } catch (error) {
      console.error("Groq API Error:", JSON.stringify(error, null, 2));
      return "Sorry, there was an error processing your request.";
    }
  }

  // Method to reset conversation context
  resetContext() {
    this.conversationHistory = [
      {
        role: "system",
        content: "You are an international career counselor providing personalized guidance to students.",
      },
    ];
  }
}
