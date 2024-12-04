export interface User {
    id: string; 
    name?: string | null; 
    email: string; 
    username?: string | null; 
    password?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    phone?: string | null; 
    age?: number | null;
    nationality?: string | null; 
    previousDegree?: string | null;
    grades?: string | null; 
    currentEducationLevel?: string | null;
    preferredCountries?: string | null; 
    preferredPrograms?: string | null;
    careerAspirations?: string | null; 
    visaQuestions?: string | null; 
    filledApplication?: boolean | null;
}
  