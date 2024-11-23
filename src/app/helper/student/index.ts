import axios from "axios";

const apiUrl = "/api/student";

export const getAllStudents = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw new Error("Failed to fetch students");
  }
};

export const getStudentById = async (id: number) => {
  try {
    const response = await axios.get(`${apiUrl}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student:", error);
    throw new Error("Failed to fetch student");
  }
};

interface StudentData {
  name: string;
  email: string;
  phone: string;
  age: number;
  nationality: string;
  previousDegree: string;
  grades: string;
  currentEducationLevel: string;
  preferredCountries: string;
  preferredPrograms: string;
  careerAspirations: string;
  visaQuestions?: string;
}

export const createStudent = async (data: StudentData) => {
  try {
    const response = await axios.post(apiUrl, data);
    return response.data;
  } catch (error) {
    console.error("Failed to create student:", error);
    throw new Error("Failed to create student");
  }
};

interface StudentUpdateData {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  age?: number;
  nationality?: string;
  previousDegree?: string;
  grades?: string;
  currentEducationLevel?: string;
  preferredCountries?: string;
  preferredPrograms?: string;
  careerAspirations?: string;
  visaQuestions?: string;
}

export const updateStudent = async (data: StudentUpdateData) => {
  try {
    const response = await axios.put(apiUrl, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update student:", error);
    throw new Error("Failed to update student");
  }
};

export const deleteStudent = async (id: number) => {
  try {
    const response = await axios.delete(`${apiUrl}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete student:", error);
    throw new Error("Failed to delete student");
  }
};
