import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/types/auth";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/account(.*)",
  "/api/users(.*)",
  "/api/admin(.*)"
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  // For protected routes, ensure user is authenticated
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Handle API routes with role-based access
  if (pathname.startsWith("/api/users") && userId && sessionClaims) {
    const publicMetadata = sessionClaims.publicMetadata as any || {};
    const userRole = publicMetadata.role as UserRole || UserRole.USER;
    
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
