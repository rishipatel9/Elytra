import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";

const NEXT_AUTH = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true }
      },
      async authorize(credentials) {
        const existingUser = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
    
        if (existingUser) {
          throw new Error("User already exists, please sign in.");
        }
    
        const newUser = await prisma.user.create({
          data: {
            email: credentials?.email ?? "",
            password: credentials?.password, 
            name: credentials?.name,
          }
        });
    
        return { id: String(newUser.id), name: newUser.name, email: newUser.email };
      }
    })
       
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // console.log('session:', session);
      // console.log('token:', token);
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },
  events: {
    async signIn({ user }: { user: any }) {
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

export { NEXT_AUTH };

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
}
