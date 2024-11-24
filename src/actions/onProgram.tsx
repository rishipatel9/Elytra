'use server'

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const prisma = new PrismaClient();

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
    const validatedData = programSchema.parse(formData);

    const program = await prisma.program.create({
      data:{
        name: validatedData.name,
        description: validatedData.description || "",
        mode: validatedData.mode || "",
        duration: validatedData.duration || "",
        category: validatedData.category || "",
        fees: validatedData.fees || "",
        eligibility: validatedData.eligibility || ""
      }
    });

    revalidatePath('/programs');

    return { 
      success: true, 
      message: "Program created successfully",
      program 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join(", ");
      return { success: false, message: `Validation error: ${errorMessages}` };
    }

    console.error("Error creating program:", error);
    return { success: false, message: "Failed to create program" };
  }
}

export async function getPrograms() {
  noStore();
  try {
    const programs = await prisma.program.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return programs;
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw new Error("Failed to fetch programs");
  }
}

export async function getProgram(id: string) {
  noStore();
  try {
    const program = await prisma.program.findUnique({
      where: { id: parseInt(id, 10) }
    });
    
    if (!program) {
      throw new Error("Program not found");
    }
    
    return program;
  } catch (error) {
    console.error("Error fetching program:", error);
    throw new Error("Failed to fetch program");
  }
}