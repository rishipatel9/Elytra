import { NEXT_AUTH } from "@/lib/auth";
import { AuthOptions, getServerSession } from "next-auth";

export const getUserDetails = async () => {
  const session = await getServerSession(NEXT_AUTH as AuthOptions);
  return session;
};
