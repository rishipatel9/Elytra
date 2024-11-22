import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_SECRET,
  pages: {
    signIn: "/signup",
    error: "/auth/error",
  },
  callbacks: {
    async redirect() {
      return "/dashboard";
    },
  },
  
};

export { NEXT_AUTH };
