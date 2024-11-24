// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth/signin",
    },
     
});

export const config = {
    matcher: [
        "/", // Protects the root route
        "/execute/:path*", // Protects all routes under /execute
        "/profile/:path*", // Protects all routes under /profile
    ],
};
