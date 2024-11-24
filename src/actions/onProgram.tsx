'use server'

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Gemini API
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({ apiKey:process.env.NEXT_PUBLIC_PINECONE_API_KEY || " "})

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY|| " ");
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

 

const index = pinecone.Index("program-recommendations"); // Replace with your Pinecone index name

const programSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  mode: z.string().optional(),
  duration: z.string().optional(),
  category: z.string().optional(),
  fees: z.string().optional(),
  eligibility: z.string().optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;

export async function createProgram(formData: ProgramFormData) {
  noStore();
  try {
    // Validate form data
    const validatedData = programSchema.parse(formData);

    // Create the program in your Prisma database
    const program = await prisma.program.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || "",
        mode: validatedData.mode || "",
        duration: validatedData.duration || "",
        category: validatedData.category || "",
        fees: validatedData.fees || "",
        eligibility: validatedData.eligibility || "",
      },
    });

    // Generate embeddings using Gemini API
    const textToEmbed = `${validatedData.name} ${validatedData.description || ""}`;
    const embeddingResult = await model.embedContent(textToEmbed);

    // Upsert embeddings into Pinecone
    const embeddingVector = embeddingResult.embedding.values;
    await index.upsert([
  {
    id: program.id.toString(),
    values: embeddingVector,
    metadata: {
      name: validatedData.name,
      description: validatedData.description || "",
      mode: validatedData.mode || "",
      duration: validatedData.duration || "",
      category: validatedData.category || "",
      fees: validatedData.fees || "",
      eligibility: validatedData.eligibility || "",
    },
  },
]);


    // Revalidate the path
    revalidatePath("/programs");

    return {
      success: true,
      message: "Program created successfully and upserted into Pinecone",
      program,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ");
      return { success: false, message: `Validation error: ${errorMessages}` };
    }

    console.error("Error creating program:", error);
    return { success: false, message: "Failed to create program" };
  }
}
