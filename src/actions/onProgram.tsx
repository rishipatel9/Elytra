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

// Updated program schema
const programSchema = z.object({
  university: z.string().min(1, "University is required"),

  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  mode: z.string().optional(),
  duration: z.string().optional(),
  category: z.string().optional(),
  fees: z.string().optional(),
  eligibility: z.object({
    ugBackground: z.string().optional(),
    minimumGpa: z.string().optional(),
    backlogs: z.number().optional(),
    workExperience: z.string().optional(),
    allow3YearDegree: z.string().optional(),
    decisionFactor: z.string().optional(),
  }),
  ranking: z.string().optional(),
  college: z.string().optional(),
  location: z.string().optional(),
  publicPrivate: z.string().optional(),
  specialLocationFeatures: z.string().optional(),
  specialUniversityFeatures: z.string().optional(),
  specialization: z.string().optional(),
  usp: z.string().optional(),
  iitIim: z.string().optional(), 
  curriculum: z.string().optional(),
  coOpInternship: z.string().optional(),
  gloveraPricing:  z.union([z.string(), z.number()]).optional(),
  originalPricing:  z.union([z.string(), z.number()]).optional(),
  savings:  z.union([z.string(), z.number()]).optional(),
  savingsPercentage:  z.union([z.string(), z.number()]).optional(),
  totalCredits:  z.union([z.string(), z.number()]).optional(),
  creditsInIITIIM:  z.union([z.string(), z.number()]).optional(),
  creditsInUS:  z.union([z.string(), z.number()]).optional(),
  applicationFee:  z.union([z.string(), z.number()]).optional(),
  deposit:  z.union([z.string(), z.number()]).optional(),
  canFinishIn: z.string().optional(),
  
  transcriptEvaluation: z.string().optional(), // Added new field
  lor: z.string().optional(), // Added new field
  sop: z.string().optional(), // Added new field
  interviews: z.string().optional(), // Added new field
 
  depositRefundableVisa: z.string().optional(), // Added new field
  keyCompaniesHiring: z.string().optional(), // Added new field
  keyJobRoles: z.string().optional(), // Added new field
  quantQualitative: z.string().optional(), // Added new field
});

// Eligibility schema
const eligibilitySchema = z.object({
  university: z.string().min(1, "University is required"),
  program: z.string().min(1, "Program name is required"),
  typeOfProgram: z.string().optional(),
  percentage: z.string().optional(),
  backlogs: z.union([z.string(), z.number()]).transform(val => val === '' ? null : Number(val)).optional(),
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

// Helper function to safely convert values to numbers
function safeNumberConversion(value: any): number | null {
  if (value === undefined || value === null || value === '' || value === 'NA' || value === 'N/A') {
    return null;
  }
  // Handle string numbers with commas
  if (typeof value === 'string') {
    // Remove commas and $ signs
    value = value.replace(/[$,]/g, '');
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// Function to map Excel row to program object
function mapExcelRowToProgram(row: any) {
  return {
    name: row['Program Name'] || '',
    university: row['University'] || '',
    eligibility: {
      ugBackground: row['UG Background'] || '',
      minimumGpa: row['Minimum GPA or %'] || '',
      backlogs: safeNumberConversion(row['Backlogs']) ?? 0,
      workExperience: row['Work Experience'] || '',
      allow3YearDegree: row['Will allow 3 years undergrad candidates?'] || '',
      decisionFactor: row['Decision Factor'] || '',
    },
    ranking: row['Ranking'] || '',
    college: row['College'] || '',
    location: row['Location'] || '',
    publicPrivate: row['Public/Private'] || '',
    specialLocationFeatures: row['Whats Special About this location'] || '',
    specialUniversityFeatures: row['Whats Special about this Univ/ College'] || '',
    specialization: row['Specialization/ Concentrations Possible'] || '',
    usp: row['Top USP of this Program'] || '',
    curriculum: row['Curriculum'] || '',
    iitIim: row['IIT/IIM?'] || '',
    coOpInternship: row['Co-op'] || '',
    gloveraPricing: safeNumberConversion(row['Glovera Pricing']),
    originalPricing: safeNumberConversion(row['Original Pricing']),
    savings: safeNumberConversion(row['Savings']),
    savingsPercentage: safeNumberConversion(row['Savings %']),
    totalCredits: safeNumberConversion(row['Total Credits']),
    creditsInIITIIM: safeNumberConversion(row['Credits in IIT/IIM']),
    creditsInUS: safeNumberConversion(row['Credits in US']),
    applicationFee: row['Application Fee'] || '',
    deposit: safeNumberConversion(row['Deposit']),
    canFinishIn: row['Can finish in'] || '',
    transcriptEvaluation: row['Transcript Evaluation'] || '',
    lor: row['LOR'] || '',
    sop: row['SOP'] || '',
    interviews: row['Interviews'] || '',
    depositRefundableVisa: row['Deposit (Refundable in case of visa rejection)'] || '',
    keyCompaniesHiring: row['Key Companies Hiring'] || '',
    keyJobRoles: row['Key Job Roles'] || '',
    quantQualitative: row['Quant/ Qualitative'] || '',
  };
}

// Function to map Excel row to eligibility object
function mapExcelRowToEligibility(row: any): z.infer<typeof eligibilitySchema> {
  return {
    university: row['University'] || '',
    program: row['Program'] || '',
    typeOfProgram: row['Type Of Program'] || '',
    percentage: row['Percentage'] || '',
    backlogs: row['Backlogs'] || '',
    workExperience: row['Work Experience (yrs)'] || '',
    allow3YearDegree: row['Allow 3-Year Degree'] || '',
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
    console.log(`Loaded ${data.length} eligibility entries from ${filePath}`);
    
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
        const validEligibilityData = eligibilitySchema.parse(eligibilityData);
        const eligibility = await prisma.eligibility.create({
          data: {
            university: validEligibilityData.university,
            program: validEligibilityData.program,
            typeOfProgram: validEligibilityData.typeOfProgram || "",
            percentage: validEligibilityData.percentage || "",
            backlogs: validEligibilityData.backlogs ? String(validEligibilityData.backlogs) : null, 
            workExperience: validEligibilityData.workExperience || "",
            allow3YearDegree: validEligibilityData.allow3YearDegree || "",
            minimumGpaOrPercentage: validEligibilityData.minimumGpaOrPercentage || "",
            decisionFactor: validEligibilityData.decisionFactor || "",
          },
        });

        // Generate embedding for eligibility data
        const textToEmbed = `${validEligibilityData.university} - ${validEligibilityData.program} - Eligibility details: Work Experience ${validEligibilityData.workExperience}, Backlogs ${validEligibilityData.backlogs}, 3-Year Degree ${validEligibilityData.allow3YearDegree}`;
        const embeddingResult = await model.embedContent(textToEmbed);
        const embeddingVector = embeddingResult.embedding.values;

        // Upsert eligibility details to the existing program index
        await programIndex.upsert([
          {
            id: `eligibility-${validEligibilityData.university}-${validEligibilityData.program}`,
            values: embeddingVector,
            metadata: {
              EligibilityUniversity: validEligibilityData.university,
              EligibilityProgram: validEligibilityData.program,
              EligibilityTypeOfProgram: validEligibilityData.typeOfProgram || "",
              EligibilityPercentage: validEligibilityData.percentage || "N/A",
              EligibilityBacklogs: validEligibilityData.backlogs || "N/A",
              EligibilityWorkExperience: validEligibilityData.workExperience || "N/A",
              EligibilityAllow3YearDegree: validEligibilityData.allow3YearDegree?.toString() || "false",
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
    
    // Track successful and failed imports
    const importResults = {
      total: data.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process each row
    for (const [index, row] of data.entries()) {
      // Add debug logging for specific rows
      if (index + 1 >= 23 && index + 1 <= 28) {
        console.log(`\n=== Debug Row ${index + 1} ===`);
        // @ts-ignore
        console.log('Raw deposit value:', row['Deposit']);
        console.log('Raw row data:', JSON.stringify(row, null, 2));
      }

      try {
        // Convert row to program object
        const programData = mapExcelRowToProgram(row);
        
        // Add more debug logging for problematic rows
        if (index + 1 >= 23 && index + 1 <= 28) {
          console.log(`Mapped deposit value for Row ${index + 1}:`, programData.deposit);
          console.log('Full mapped data:', JSON.stringify(programData, null, 2));
        }
        
        // Validate the data
        try {
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
              transcriptEvaluation: validatedData.transcriptEvaluation || "",
              lor: validatedData.lor || "",
              sop: validatedData.sop || "",
              interviews: validatedData.interviews || "",
              applicationFee: validatedData.applicationFee ? String(validatedData.applicationFee) : null,
              deposit: validatedData.deposit ? String(validatedData.deposit) : null,
              depositRefundableVisa: validatedData.depositRefundableVisa || "",
              keyCompaniesHiring: validatedData.keyCompaniesHiring || "",
              keyJobRoles: validatedData.keyJobRoles || "",
              quantQualitative: validatedData.quantQualitative || "",
              createdAt: new Date(),
              updatedAt: new Date(),
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
                TranscriptEvaluation: validatedData.transcriptEvaluation || "",
                LOR: validatedData.lor || "",
                SOP: validatedData.sop || "",
                Interviews: validatedData.interviews || "",
                ApplicationFee: validatedData.applicationFee || "",
                Deposit: validatedData.deposit || "",
                DepositRefundableVisa: validatedData.depositRefundableVisa || "",
                KeyCompaniesHiring: validatedData.keyCompaniesHiring || "",
                KeyJobRoles: validatedData.keyJobRoles || "",
                QuantQualitative: validatedData.quantQualitative || "",
                EligibilityUGBackground: validatedData.eligibility.ugBackground || "",
                EligibilityMinimumGPA: validatedData.eligibility.minimumGpa || "",
                EligibilityBacklogs: validatedData.eligibility.backlogs || "",
                EligibilityWorkExperience: validatedData.eligibility.workExperience || "",
                EligibilityAllow3YearDegree: validatedData.eligibility.allow3YearDegree || "",
              },
            },
          ]);

          importResults.successful++;
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            const errorDetails = validationError.errors.map(err => {
              const path = err.path.join('.');
              return `Field '${path}': ${err.message}`;
            }).join(', ');
            console.error(`Row ${index + 1} validation error:`, errorDetails);
            importResults.errors.push(`Row ${index + 1}: ${errorDetails}`);
          }
          throw validationError;
        }
      } catch (error) {
        importResults.failed++;
        if (error instanceof z.ZodError) {
          const errorDetails = error.errors.map(err => {
            const path = err.path.join('.');
            return `Field '${path}': ${err.message}`;
          }).join(', ');
          importResults.errors.push(`Row ${index + 1}: ${errorDetails}`);
        } else {
          importResults.errors.push(`Row ${index + 1} error: ${error}`);
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