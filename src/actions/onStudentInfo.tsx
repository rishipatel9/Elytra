
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { z } from "zod";

const studentDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be less than 15 characters"),
  age: z.number().min(18, "Age must be at least 18").max(100, "Age must be less than 100"),
  nationality: z.string().min(1, "Nationality is required"),
  previousDegree: z.string().min(1, "Previous degree is required"),
  grades: z.string().min(1, "Grades are required"),
  currentEducationLevel: z.string().min(1, "Current education level is required"),
  preferredCountries: z.array(z.string()).min(1, "At least one preferred country is required"),
  preferredPrograms: z.string().min(1, "Preferred programs are required"),
  careerAspirations: z.string().min(1, "Career aspirations are required"),
  visaQuestions: z.string().optional(),
});

type StudentDataFormType = z.infer<typeof studentDataSchema>;

export async function uploadStudentInfo(formData: StudentDataFormType) {
    try {
    //   const validatedData = studentDataSchema.parse(formData);
    const validatedData = formData;
  
      const session = await getSession();
  
      if (!session) {
        throw new Error("You must be logged in to create a student");
      }
  
      const userEmail = session.user?.email;
  
      if (!userEmail) {
        throw new Error("User ID not found in session");
      }

      const updatedUser = await prisma.user.update({
        where: { email:userEmail },
        data: {
          name: validatedData.name,
          phone: validatedData.phone,
          age: validatedData.age,
          nationality: validatedData.nationality,
          previousDegree: validatedData.previousDegree,
          grades: validatedData.grades,
          currentEducationLevel: validatedData.currentEducationLevel,
          preferredCountries: validatedData.preferredCountries.join(", "),
          preferredPrograms: validatedData.preferredPrograms,
          careerAspirations: validatedData.careerAspirations,
          visaQuestions: validatedData.visaQuestions ?? "",
          filledApplication: true, 
        },
      });
  
      return updatedUser; 
    } catch (error) {
      console.error("Error updating student:", error);
      throw new Error("Error updating student");
    }
  }