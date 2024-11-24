 
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the `id` property
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // Ensure `User` also includes `id`
  }
}
