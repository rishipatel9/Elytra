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
     **Guidelines:**
        - Each bullet point must be a single sentence (1-2 lines max).
        - Be direct, clear, and actionable.
        - Avoid overly long explanations; focus on what matters most.
        - Skip links or lengthy recommendations; additional context is handled separately.

 
    Be precise, insightful, and impactful. Always aim to provide answers that students can trust and act upon confidently.
    
   ***Important 
    Try not to site any resource links in your response an seperate call is done for that
    In the previous messagethe assistant has  provided some program/course recommendations   if the user explicitly asks for them, or if their query clearly suggests
    that they need help with selecting programs, courses, or educational paths.
    If the query is unrelated to recommendations, do not include them in your response. Answer all other questions more generally or based on the available student context.
    
    But if u think user has asked some query related to program and course and the assistans rreccomendation from the vector db search can be sued somehow try to integrate in your repsonse but be very midful when to and when not to
    For context, here is detailed information about the student:
    ${studentDetails}
  `,
});

    return this;
  } 

  // In OpenAIAssistant Class
async getResponse(userMessage: string,programContexts: string[]): Promise<string> {
  try {
    // Existing implementation to get main response
    if (programContexts.length > 0) {
                console.log(programContexts)
                this.conversationHistory.push({
                    role: "system",
                    content: `Here are some  programs  I found doing a similarity vector search in vector db  :\n${programContexts.join("\n\n")}`,
                });
    }
    
     console.log(`conversation history ${JSON.stringify(this.conversationHistory)}`)

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
          content: `
          You are an expert in generating supplementary resources and actionable follow-up questions for students. 
          Based on the user's input, provide:
          1. 2-3 **highly relevant, credible, and student-specific** online resources (URLs or platform names).
          2. 3-4 **practical, actionable, and targeted** follow-up questions a student might ask regarding their education or career decisions.
          
          Ensure:
          - Avoid vague, generic phrases like "How can I help?" or unrelated topics.
          - Questions should prompt meaningful exploration or clarify the user's goals.
          - Resources should be  highly relevant.

          *Important:See the questions we are providing to the user are questions the user can ask to you the llm okay so always keep in mind
          give the questions from the persperctive of the user that they can ask a llm helping with international carrer counselling with the details of the user
          can answer and indeed once again help the usetr only
          
          Response format:
          Resources:
          [URLs]
          Questions:
          [List of questions]
          `,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      temperature: 0.6,
    });

    const responseText =
      completion.choices[0]?.message?.content ||
      "No additional context available.";

    // Extract resources
    const resourceRegex = /(https?:\/\/[^\s]+)/g;
    const resources = (responseText.match(resourceRegex) || [])
      .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicate URLs
      .slice(0, 3); // Limit to 3 resources

    // Extract questions
    const questionStartIndex = responseText.indexOf("Questions:");
    const questionsText = questionStartIndex > -1 ? responseText.slice(questionStartIndex) : "";
    const suggestedQuestions = questionsText
      .split("\n")
      .filter((line) => line.trim().length > 0 && !resourceRegex.test(line)) // Exclude empty lines and URLs
      .map((question) => question.replace(/^Questions:/, "").trim()) // Remove the "Questions:" label
      .slice(0, 4); // Limit to 4 questions

    return {
      resources,
      suggestedQuestions,
    };
  } catch (error) {
    console.error("Additional Context Error:", error);
    return {
      resources: [],
      suggestedQuestions: [
        "What are the top universities for this career?",
        "How can I finance my education?",
        "What are the job prospects in this field?",
      ],
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
