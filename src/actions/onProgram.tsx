'use server'

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from '@pinecone-database/pinecone'
import * as XLSX from "xlsx";

import path from 'path';
import * as fs from 'fs';

import { myName } from "../../water";



// Existing program schema
// Updated program schema
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
    allow3YearDegree: z.string().optional(),
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
  gloveraPricing: z.string().optional(), // Added new field for financial aspect
  originalPricing: z.string().optional(), // Added new field
  savings: z.string().optional(), // Added new field
  savingsPercentage: z.string().optional(), // Added new field
  totalCredits: z.string().optional(), // Added new field
  iitIim: z.string().optional(),
  creditsInIITIIM: z.string().optional(), // Added new field for specific credit details
  creditsInUS: z.string().optional(), // Added new field for international credits
  canFinishIn: z.string().optional(), // Added new field for time to completion
});


// Existing eligibility schema
const eligibilitySchema = z.object({
  university: z.string().min(1, "University is required"),
  program: z.string().min(1, "Program name is required"),
  typeOfProgram: z.string().optional(),
  percentage: z.string().optional(),
  backlogs: z.string().optional(),
  workExperience: z.string().optional(),
  allow3YearDegree: z.string().optional(),
  minimumGpaOrPercentage: z.string().optional(), 
  decisionFactor: z.string().optional(), 
});
// Initialize Gemini and Pinecone
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || " ");
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
const pinecone = new Pinecone({ apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || " " });
const programIndex = pinecone.Index("program-recommendations");
const eligibilityIndex = pinecone.Index("eligibility");

// Function to map Excel row to program object
function mapExcelRowToProgram(row: any): z.infer<typeof programSchema> {
  return {
    name: row['Program Name'] || '',
    description: row['Description'] || '',
    mode: row['Mode'] || '',
    duration: row['Duration'] || '',
    category: row['Category'] || '',
    fees: row['Fees'] || '',
    eligibility: {
      ugBackground: row['UG Background'] || '',
      minimumGpa: row['Minimum GPA'] || '',
      backlogs: row['Backlogs'] || '',
      workExperience: row['Work Experience'] || '',
      allow3YearDegree: row['Allow 3-Year Degree'] || '',
    },
    ranking: row['Ranking'] || '',
    university: row['University'] || '',
    college: row['College'] || '',
    location: row['Location'] || '',
    publicPrivate: row['Public/Private'] || '',
    specialLocationFeatures: row['Special Location Features'] || '',
    specialUniversityFeatures: row['Special University Features'] || '',
    specialization: row['Specialization'] || '',
    usp: row['USP'] || '',
    curriculum: row['Curriculum'] || '',
    coOpInternship: row['Co-Op/Internship'] || '',
    gloveraPricing: row['Glovera Pricing'] || '', // Handling new field
    originalPricing: row['Original Pricing'] || '', // Handling new field
    savings: row['Savings'] || '', // Handling new field
    savingsPercentage: row['Savings %'] || '', // Handling new field
    totalCredits: row['Total Credits'] || '', // Handling new field
    iitIim: row['IIT/IIM?'] || '', // Handling IIT/IIM distinction
    creditsInIITIIM: row['Credits in IIT/IIM'] || '', // Handling new field
    creditsInUS: row['Credits in US'] || '', // Handling new field
    canFinishIn: row['Can finish in'] || '', // Handling new field
  };
}


// Function to map Excel row to eligibility object
function mapExcelRowToEligibility(row: any): z.infer<typeof eligibilitySchema> {
  return {
    university: row['University'] || '',
    program: row['Program Name'] || '',
    typeOfProgram: row['TypeOfProgram'] || '',
    percentage: row['Percentage'] || '',
    backlogs: row['Backlogs'] || '',
    workExperience: row['Work Experience'] || '',
    allow3YearDegree: row['Allow 3-Year Degree'] || '',
    minimumGpaOrPercentage: row['Minimum GPA or %'] || '', // Handling new field
    decisionFactor: row['Decision Factor'] || '', // Handling new field
  };
}
function diagnoseFileAccess(filePath: string) {
  try {
    // Check file existence
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return false;
    }

    // Check file stats
    const stats = fs.statSync(filePath);
    
    console.log('File stats:', {
      isFile: stats.isFile(),
      size: stats.size,
      permissions: stats.mode.toString(8), // Octal representation of permissions
    });

    // Attempt to read
    fs.accessSync(filePath, fs.constants.R_OK);
    
    return true;
  } catch (error) {
    console.error(`File access error for ${filePath}:`, error);
    return false;
  }
}

// Bulk import function for programs
export async function bulkImportPrograms(filePath: string) {
  noStore();
  
  try {
    // Read the Excel file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Read workbook from buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convert worksheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`Loaded ${data.length} programs from ${filePath}`);
    console.log(data);
    
    
    
    // Track successful and failed imports
    const importResults = {
      total: data.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each row
    for (const row of data) {
      try {
        // Convert row to program object
        const programData = mapExcelRowToProgram(row);
        
        // Validate the data
        const validatedData = programSchema.parse(programData);

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
            
            // New fields added to match the updated Prisma schema
            gloveraPricing: validatedData.gloveraPricing || "",
            originalPricing: validatedData.originalPricing || "",
            savings: validatedData.savings || "",
            savingsPercentage: validatedData.savingsPercentage || "",
            totalCredits: validatedData.totalCredits || "",
            iitIim: validatedData.iitIim || "",
            creditsInIITIIM: validatedData.creditsInIITIIM || "",
            creditsInUS: validatedData.creditsInUS || "",
            canFinishIn: validatedData.canFinishIn || "",
          },
        });
        

        // Generate embedding
        const textToEmbed = `${validatedData.name} at ${validatedData.university} - ${validatedData.description || ""}`;
        const embeddingResult = await model.embedContent(textToEmbed);
        const embeddingVector = embeddingResult.embedding.values;

        // Upsert program details to Pinecone
        await programIndex.upsert([
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

        importResults.successful++;
      } catch (error) {
        importResults.failed++;
        if (error instanceof z.ZodError) {
          const errorMessages = error.errors.map((err) => err.message).join(", ");
          importResults.errors.push(`Validation error for row: ${errorMessages}`);
        } else {
          importResults.errors.push(`Error importing row: ${error}`);
        }
      }
    }

    // Revalidate the path
    revalidatePath("/programs");

    return {
      success: true,
      message: "Bulk import of programs completed",
      results: importResults
    };
  } catch (error) {
    console.error("Error in bulk import of programs:", error);
    return {
      success: false, 
      message: "Failed to perform bulk import of programs",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Bulk import function for eligibility
export async function bulkImportEligibility(filePath: string) {
  noStore();
  
  try {
    // Read the Excel file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Read workbook from buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convert worksheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`Loaded ${data.length} programs from ${filePath}`);
    console.log(data);
    
    // Track successful and failed imports
    const importResults = {
      total: data.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each row
    for (const row of data) {
      try {
        // Convert row to eligibility object
        const eligibilityData = mapExcelRowToEligibility(row);
        
        // Validate the data
        const validatedData = eligibilitySchema.parse(eligibilityData);

        // Generate embedding
        const textToEmbed = `${validatedData.university} - ${validatedData.program} - ${validatedData.typeOfProgram || ""}`;
        const embeddingResult = await model.embedContent(textToEmbed);
        const embeddingVector = embeddingResult.embedding.values;

        // Upsert eligibility details to Pinecone
        await eligibilityIndex.upsert([
          {
            id: `eligibility-${validatedData.university}-${validatedData.program}`,
            values: embeddingVector,
            metadata: {
              University: validatedData.university,
              Program: validatedData.program,
              TypeOfProgram: validatedData.typeOfProgram || "",
              Percentage: validatedData.percentage || "N/A",
              Backlogs: validatedData.backlogs || "N/A",
              WorkExperience: validatedData.workExperience || "N/A",
              Allow3YearDegree: validatedData.allow3YearDegree?.toString() || "false",
            },
          },
        ]);

        importResults.successful++;
      } catch (error) {
        importResults.failed++;
        if (error instanceof z.ZodError) {
          const errorMessages = error.errors.map((err) => err.message).join(", ");
          importResults.errors.push(`Validation error for row: ${errorMessages}`);
        } else {
          importResults.errors.push(`Error importing row: ${error}`);
        }
      }
    }

    return {
      success: true,
      message: "Bulk import of eligibility data completed",
      results: importResults
    };
  } catch (error) {
    console.error("Error in bulk import of eligibility data:", error);
    return {
      success: false, 
      message: "Failed to perform bulk import of eligibility data",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Usage example
// export async function importDataFromExcel() {
//   const courseFilePath = path.join(process.cwd(), 'src', 'Courses.xlsx');
//   const eligibilityFilePath = path.join(process.cwd(), 'src', 'Eligibility.xlsx');
//   console.log('Current working directory:', process.cwd());
// console.log('Full course file path:', courseFilePath);
// console.log('Full eligibility file path:', eligibilityFilePath);

// console.log('File exists:', fs.existsSync(courseFilePath));
// diagnoseFileAccess(courseFilePath);
// diagnoseFileAccess(eligibilityFilePath);

//   // const courseFilePath = '/Courses.xlsx';
//   // const eligibilityFilePath = '/Eligibility.xlsx';
  
//   // console.log('Attempting to read from:');
//   // console.log('Courses:', courseFilePath);
//   // console.log('Eligibility:', eligibilityFilePath);

//   await bulkImportPrograms(courseFilePath);
//   await bulkImportEligibility(eligibilityFilePath);
// }

export async function importDataFromExcel() {
  try {
    const courseFilePath = path.join(process.cwd(), 'src', 'Courses.xlsx');
    const eligibilityFilePath = path.join(process.cwd(), 'src', 'Eligibility.xlsx');
    
    console.log('Attempting to import from:', {
      coursePath: courseFilePath,
      eligibilityPath: eligibilityFilePath
    });

    const programsResult = await bulkImportPrograms(courseFilePath);
    console.log('Programs Import Result:', programsResult);

    const eligibilityResult = await bulkImportEligibility(eligibilityFilePath);
    console.log('Eligibility Import Result:', eligibilityResult);
    

    return {
      programs: programsResult,
      eligibility: eligibilityResult
    };
  } catch (error) {
    console.error('Complete import error:', error);
    throw error;
  }
}