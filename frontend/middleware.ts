import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextRequest) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If user is admin and tries to access a non-admin page,
    // redirect them to the admin dashboard.
    // This handles the redirect immediately after login.
    if (token?.role === "admin" && !pathname.startsWith("/admin-dashboard")) {
        // Allow access to API routes and the main page
        if (pathname.startsWith("/api") || pathname === "/") return NextResponse.next();
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }
    
    // If user is not admin and tries to access an admin page,
    // redirect them to their user dashboard.
    if (token?.role !== "admin" && pathname.startsWith("/admin-dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/admin-dashboard/:path*'],
}; 