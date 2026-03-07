import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
    const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const customToken = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    let userRole = nextAuthToken?.role;

    // If no NextAuth session, try to verify custom token
    if (!userRole && customToken) {
        try {
            const { payload } = await jwtVerify(customToken, JWT_SECRET);
            userRole = payload.role || "student";
        } catch (err) {
            // Invalid custom token
        }
    }

    // 1. If not logged in and trying to access protected routes
    if (!userRole && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. Role-based Redirection for base /dashboard
    if (userRole && pathname === "/dashboard") {
        if (userRole === "instructor") {
            return NextResponse.redirect(new URL("/dashboard/instructor", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }

    // 3. Protect Instructor Routes
    if (pathname.startsWith("/dashboard/instructor") && userRole !== "instructor") {
        return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }

    // 4. Protect Student Routes
    if (pathname.startsWith("/dashboard/student") && userRole !== "student") {
        if (userRole === "instructor") {
            return NextResponse.redirect(new URL("/dashboard/instructor", req.url));
        }
    }

    return NextResponse.next();
}

// Apply middleware only to /dashboard routes
export const config = {
    matcher: ["/dashboard/:path*"],
};
