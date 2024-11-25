import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";

// const NEXT_AUTH = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID || "",
//       clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
//     }),
//   ],
//   secret: process.env.NEXT_SECRET,
//   pages: {
//     signIn: "/signup",
//     error: "/auth/error",
//   },
//   callbacks: {
//     async redirect() {
//       return "/dashboard";
//     },
//   },
//   // events:{
//   //   async signIn({user}:{user:User}){  
      
//   //   },
//   // }
  
// };
const NEXT_AUTH = {
  adapter: PrismaAdapter(prisma),
      secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user }:{user:any}) {
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


export { NEXT_AUTH };


export type User ={
  id: string;
  name: string;
  email: string;
  image: string;
}