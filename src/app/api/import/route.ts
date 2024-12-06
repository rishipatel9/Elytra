import { importDataFromExcel } from "@/actions/onProgram";
import { NextResponse } from "next/server";
//search for this to run on your browser to dump the data but if you do it again and again, db is fucked!!
// http://localhost:3000/api/import
export async function GET() {
  try {
    const result = await importDataFromExcel();
    console.log(`Log result ${result}`);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
