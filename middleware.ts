// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { getUserDetails } from './utils';

// // Define protected routes
// const ADMIN_ROUTES = [
//     '/admin/dashboard',
//     '/admin/dashboard/analytics',
//     '/admin/dashboard/users',
//     '/admin/dashboard/metrics'
// ];

// const USER_DASHBOARD_ROUTES = [
//     '/dashboard',
//     '/dashboard/:path*'
// ];

// export function middleware(request: NextRequest) {
//     const { nextUrl } = request;

//     // Extract token from cookies
//     const token = request.cookies.get('token')?.value;

//     // Current path
//     const currentPath = nextUrl.pathname;

//     // Check for admin routes
//     const isAdminRoute = ADMIN_ROUTES.some(route =>
//         currentPath.startsWith(route)
//     );

//     // Check for user dashboard routes
//     const isUserRoute = currentPath.startsWith('/dashboard');

//     // Handle admin routes
//     if (isAdminRoute) {
//         return handleAdminRoute(token, request);
//     }

//     // Handle user dashboard routes
//     if (isUserRoute) {
//         return handleUserRoute(token, request);
//     }

//     return NextResponse.next(); // Allow other routes to proceed
// }

// function handleAdminRoute(token: string | undefined, request: NextRequest) {
//     if (!token) {
//         return NextResponse.redirect(new URL('/admin/login', request.url));
//     }

//     try {
//         const JWT_SECRET = process.env.JWT_SECRET || '';
//         const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

//         if (decoded.role === 'admin') {
//             return NextResponse.next(); // Admin access granted
//         }
//         return NextResponse.redirect(new URL('/admin/login', request.url));
//     } catch {
//         return NextResponse.redirect(new URL('/auth/signin', request.url));
//     }
// }

// function handleUserRoute(token: string | undefined, request: NextRequest) {
//     try {
//         // const session = getUserDetails()
//         // if (!session) {
//         //     return NextResponse.redirect(new URL('/auth/signup', request.url));
//         // }
//         // const JWT_SECRET = process.env.JWT_SECRET || '';
//         // const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

//         // if (decoded.role === 'user') {
//         //     return NextResponse.next(); // User access granted
//         // }
//         return NextResponse.redirect(new URL('/auth/signin', request.url));
//     } catch {
//         return NextResponse.redirect(new URL('/auth/signin', request.url));
//     }
// }

// // Middleware configuration: specify route matchers
// export const config = {
//     matcher: [
//         '/admin/dashboard/:path*', // Admin routes
//         '/dashboard/:path*'        // User dashboard routes
//     ],
// };
