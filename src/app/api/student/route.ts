import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { studentSchema } from "@/lib/zod";
import { generateStudentDetails } from "@/lib/constant";



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

      const studentDetails = generateStudentDetails(student);

      return NextResponse.json(
        { message: "Student details retrieved successfully", details: studentDetails },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching student:", error);
      return NextResponse.json(
        { message: "Error fetching student", error: error },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Please provide a valid student ID" },
      { status: 400 }
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
