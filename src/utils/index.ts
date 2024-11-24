import { NEXT_AUTH } from "@/lib/auth";
import { AuthOptions, getServerSession } from "next-auth";

export const getUserDetails = async () => {
  const session = await getServerSession(NEXT_AUTH as AuthOptions);
  return session;
};
export async function loginAdmin({ email, password }: { email: string; password: string }) {
  const response = await fetch('/api/admin/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  return await response.json();
}