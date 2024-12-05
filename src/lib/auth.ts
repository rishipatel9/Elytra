import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

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
        name: { label: "Name", type: "text", optional: true },
        isSignUp: { label: "Is SignUp", type: "boolean", optional: true }, 
      },
      async authorize(credentials) {
        const { email, password, name, isSignUp } = credentials as {
          email: string;
          password: string;
          name?: string;
          isSignUp?: string;
        };
      
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
      
        // Convert isSignUp to boolean for consistency
        const isSignUpMode = isSignUp === "true";
      
        // Check for existing user
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
      
        if (isSignUpMode) {
          if (existingUser) {
            throw new Error("Email is already registered, please sign in");
          }
      
          if (!name) {
            throw new Error("Name is required for sign-up");
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
          
          console.log("user created")
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name,
            },
          });
      
          return { id: newUser.id, email: newUser.email, name: newUser.name };
        } else {
          console.log("Existing User:", existingUser);
          if (!existingUser) {
            throw new Error("Invalid email or password");
          }
      
          if (!existingUser.password) {
            throw new Error("Invalid email or password");
          }
      
          const isPasswordValid = await bcrypt.compare(password, existingUser.password);
          
          console.log("isPasswordValid:", password, existingUser.password, isPasswordValid);
          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }
      
          return { id: existingUser.id, email: existingUser.email, name: existingUser.name };
        }
      },      
    }),    
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
    async signUp ({ user }: { user: any }) {
      try {
        console.log("SignUp event:", user);
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            username: user.email.split("@")[0],
            image: user.image,
          },
        });
      } catch (error) {
        console.error("Error in SignUp event:", error);
      }
    },
    async signIn({ user,account }: { user: any,account:any }) {
      try {
        console.log("signIn event:", user, account);
        if (account.provider !== 'credentials') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
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
  redirect:{
    callbackUrl: '/dashboard',
    home: '/dashboard',
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
