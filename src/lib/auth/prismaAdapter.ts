import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import prisma from "@/lib/prisma";

export function CustomPrismaAdapter(): Adapter {
  const adapter = PrismaAdapter(prisma);
  
  return {
    ...adapter,
    getUserByAccount: async (provider_providerAccountId) => {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: provider_providerAccountId.provider,
            providerAccountId: provider_providerAccountId.providerAccountId,
          },
        },
        include: {
          student: true,
        },
      });
      
      if (!account) return null;
      
      // Transform the student data to match what NextAuth expects
      return {
        id: account.student.id,
        email: account.student.email,
        emailVerified: account.student.emailVerified,
        image: account.student.image,
        name: account.student.name,
      };
    },
  };
}