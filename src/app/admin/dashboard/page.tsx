import AdminDashboard from "@/components/Admin/AdminDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || ""

const page = async (): Promise<JSX.Element | null> => {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken")?.value;

    // if (!adminToken) {
    //     redirect("/signup");
    //     return null; 
    // }
    try {
        //const decoded = jwt.verify(adminToken, JWT_SECRET) as { role: string };
        // if (decoded.role !== "admin") {
        //     redirect("/signup");
      //  }
        return (
            <AdminDashboard />
        );
    } catch (error) {
        console.error("Token verification failed:", error);
        redirect("/signup");
        return null;
    }
};

export default page;
