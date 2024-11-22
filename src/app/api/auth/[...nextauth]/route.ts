import { NEXT_AUTH } from "@/lib/auth";
import nextAuth, { AuthOptions } from "next-auth";

const handler = nextAuth(NEXT_AUTH as AuthOptions);

export const GET = handler;
export const POST = handler;