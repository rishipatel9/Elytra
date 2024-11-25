import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const studentSchema = z.object({
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = studentSchema.parse(body);

    const student = await prisma.user.create({
      data: parsedData,
    });
    console.log('student:', student)

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating student", error: error },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  if (id) {
    try {
      const student = await prisma.user.findUnique({
        where: { id: id },
      });
      if (!student) {
        return NextResponse.json(
          { message: "Student not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ student }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching student", error: error },
        { status: 500 }
      );
    }
  }

  try {
    const students = await prisma.user.findMany();
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching students", error: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const parsedData = studentSchema.omit({ visaQuestions: true }).parse(body);

    const student = await prisma.user.update({
      where: { id },
      data: parsedData,
    });

    return NextResponse.json({ student }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating student", error: error },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Student ID is required" },
      { status: 400 }
    );
  }

  try {
    const student = await prisma.user.delete({
      where: { id:id },
    });

    return NextResponse.json(
      { student, message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting student", error: error },
      { status: 400 }
    );
  }
}
