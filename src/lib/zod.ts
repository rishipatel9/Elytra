import { z } from "zod";

export const studentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    phone: z.string().min(1, "Phone number is required"),
    age: z
      .number()
      .min(16, "Age must be at least 16")
      .max(100, "Age must be at most 100"),
    nationality: z.string().min(1, "Nationality is required"),
    previousDegree: z.string().min(1, "Previous Degree is required"),
    grades: z.string().min(1, "Grades are required"),
    currentEducationLevel: z
      .string()
      .min(1, "Current Education Level is required"),
    preferredCountries: z.string().min(1, "Preferred Countries are required"),
    preferredPrograms: z.string().min(1, "Preferred Programs are required"),
    careerAspirations: z.string().min(1, "Career Aspirations are required"),
    visaQuestions: z.string().optional(),
  });