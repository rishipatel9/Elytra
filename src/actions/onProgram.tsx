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

 

const index = pinecone.Index("program-recommendations"); 

const programSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  mode: z.string().optional(),
  duration: z.string().optional(),
  category: z.string().optional(),
  fees: z.string().optional(),
  eligibility: z.object({
    ugBackground: z.string().optional(),
    minimumGpa: z.string().optional(),
    backlogs: z.string().optional(),
    workExperience: z.string().optional(),
    allow3YearDegree: z.boolean().optional(),
  }),
  ranking: z.string().optional(),
  university: z.string().min(1, "University is required"),
  college: z.string().optional(),
  location: z.string().optional(),
  publicPrivate: z.string().optional(),
  specialLocationFeatures: z.string().optional(),
  specialUniversityFeatures: z.string().optional(),
  specialization: z.string().optional(),
  usp: z.string().optional(),
  curriculum: z.string().optional(),
  coOpInternship: z.string().optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;
export async function createProgram(formData: ProgramFormData) {
  noStore();
  try {
    // Validate form data
    const validatedData = programSchema.parse(formData);

    // Create the program in Prisma
    const program = await prisma.program.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || "",
        mode: validatedData.mode || "",
        duration: validatedData.duration || "",
        category: validatedData.category || "",
        fees: validatedData.fees || "",
        eligibility: JSON.stringify(validatedData.eligibility),
        ranking: validatedData.ranking || "",
        university: validatedData.university,
        college: validatedData.college || "",
        location: validatedData.location || "",
        publicPrivate: validatedData.publicPrivate || "",
        specialLocationFeatures: validatedData.specialLocationFeatures || "",
        specialUniversityFeatures: validatedData.specialUniversityFeatures || "",
        specialization: validatedData.specialization || "",
        usp: validatedData.usp || "",
        curriculum: validatedData.curriculum || "",
        coOpInternship: validatedData.coOpInternship || "",
      },
    });
    const textToEmbed = `${validatedData.name} at ${validatedData.university} - ${validatedData.description || ""}`;
    const embeddingResult = await model.embedContent(textToEmbed);
    const embeddingVector = embeddingResult.embedding.values;
    await index.upsert([
      {
        id: `uni-programs-${program.id}`,
        values: embeddingVector,
        metadata: {
          Program: validatedData.name,
          Ranking: validatedData.ranking || "", 
      University: validatedData.university,
      College: validatedData.college || "",
      Location: validatedData.location || "",
      PublicPrivate: validatedData.publicPrivate || "",
      SpecialLocationFeatures: validatedData.specialLocationFeatures || "",
      SpecialUniversityFeatures: validatedData.specialUniversityFeatures || "",
      Specialization: validatedData.specialization || "",
      USP: validatedData.usp || "",
      Curriculum: validatedData.curriculum || "",
      CoOpInternship: validatedData.coOpInternship || "",
        },
      },
    ]);

    // Upsert embeddings into Pinecone for `eligibility`
    await index.upsert([
      {
        id: `eligibility-${program.id}`,
        values: embeddingVector,
        metadata: {
          University: validatedData.university,
          Program: validatedData.name,
          TypeOfProgram: validatedData.category || "",
          Percentage: validatedData.eligibility.minimumGpa || "N/A",
          Backlogs: validatedData.eligibility.backlogs || "N/A",
          WorkExperience: validatedData.eligibility.workExperience || "N/A",
          Allow3YearDegree: validatedData.eligibility.allow3YearDegree?.toString() || "false",
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

// export async function createProgram(formData: ProgramFormData) {
//   noStore();
//   try {
//     // Validate form data
//     const validatedData = programSchema.parse(formData);

//     // Create the program in your Prisma database
//     const program = await prisma.program.create({
//       data: {
//         name: validatedData.name,
//         description: validatedData.description || "",
//         mode: validatedData.mode || "",
//         duration: validatedData.duration || "",
//         category: validatedData.category || "",
//         fees: validatedData.fees || "",
//         eligibility: validatedData.eligibility || "",
//       },
//     });

//     // Generate embeddings using Gemini API
//     const textToEmbed = `${validatedData.name} ${validatedData.description || ""}`;
//     const embeddingResult = await model.embedContent(textToEmbed);

//     // Upsert embeddings into Pinecone
//     const embeddingVector = embeddingResult.embedding.values;
//     await index.upsert([
//   {
//     id: program.id.toString(),
//     values: embeddingVector,
//     metadata: {
//       name: validatedData.name,
//       description: validatedData.description || "",
//       mode: validatedData.mode || "",
//       duration: validatedData.duration || "",
//       category: validatedData.category || "",
//       fees: validatedData.fees || "",
//       eligibility: validatedData.eligibility || "",
//     },
//   },
// ]);


//     // Revalidate the path
//     revalidatePath("/programs");

//     return {
//       success: true,
//       message: "Program created successfully and upserted into Pinecone",
//       program,
//     };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       const errorMessages = error.errors.map((err) => err.message).join(", ");
//       return { success: false, message: `Validation error: ${errorMessages}` };
//     }

//     console.error("Error creating program:", error);
//     return { success: false, message: "Failed to create program" };
//   }
// }
