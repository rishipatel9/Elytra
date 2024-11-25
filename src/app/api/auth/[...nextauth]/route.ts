import nextAuth from "next-auth/next";
import { NEXT_AUTH } from "@/lib/auth";

const handler = nextAuth(NEXT_AUTH as any);
export { handler as GET, handler as POST };