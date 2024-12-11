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
 
    Be precise, insightful, and impactful. Always aim to provide answers that students can trust and act upon confidently.
    
    Try not to site any resource links in your response an seperate call is done for that

    For context, here is detailed information about the student:
    ${studentDetails}
  `,
});

    return this;
  } 

  // In OpenAIAssistant Class
async getResponse(userMessage: string): Promise<string> {
  try {
    // Existing implementation to get main response
    const completion = await this.client.chat.completions.create({
      messages: [
        ...this.conversationHistory,
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      temperature: 0.7,
    });

    const responseText = 
      completion.choices[0]?.message?.content || 
      "Sorry, I couldn't process your request.";

    return responseText;
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Sorry, there was an error processing your request.";
  }
}
async getAdditionalContext(userMessage: string): Promise<{
  resources: string[];
  suggestedQuestions: string[];
}> {
  try {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert at generating supplementary resources and follow-up questions. 
          For the given user query and context, provide:
          1. 2-3 highly relevant and credible online resources
          2. 3-4 insightful follow-up questions a student might want to ask
          
          Cumpolsary resonse format 
          Resources :
          [links]
          Questions:
          [questions]
          dont add anything else seperate api calls are for that
          
          `
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 250,
      temperature: 0.6,
    });

    const responseText = 
      completion.choices[0]?.message?.content || 
      "No additional context available.";

    // Parse resources
    const resourceRegex = /(https?:\/\/[^\s]+)/g;
    const resources = (responseText.match(resourceRegex) || [])
      .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicate URLs
      .slice(0, 3);

    // Clean up suggested questions (Remove the "Resources :" and "Questions:" labels)
    const suggestedQuestions = responseText
      .split('\n')
      .filter(line => 
        line.trim().length > 0 && 
        !resourceRegex.test(line) && 
        !line.includes('http')
      )
      .map(question => question.replace(/^Resources :|^Questions:/, '').trim()) // Remove the "Resources :" and "Questions:" labels
      .slice(0, 4);

    return { 
      resources, 
      suggestedQuestions 
    };
  } catch (error) {
    console.error("Additional Context Error:", error);
    return { 
      resources: [], 
      suggestedQuestions: [
        "What are the top universities for this career?",
        "How can I finance my education?",
        "What are the job prospects in this field?"
      ] 
    };
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
