// auth/[...nextauth]/route.ts
 import GoogleProvider from "next-auth/providers/google";
import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
      secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        const existingStudent = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingStudent) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              username: user.email!.split("@")[0],
              image: user.image,
              phone: null,
              age: null,
              nationality: null,
              previousDegree: null,
              grades: null,
              currentEducationLevel: null,
              preferredCountries: null,
              preferredPrograms: null,
              careerAspirations: null,
              visaQuestions: null,
            },
          });
        }
      } catch (error) {
        console.error("Error in signIn event:", error);
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };