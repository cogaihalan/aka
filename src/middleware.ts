import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { UserRole, UserPermission } from "@/types/auth";
import { getRouteProtection } from "@/lib/auth/utils";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/account(.*)",
  "/api/users(.*)",
  "/api/admin(.*)"
]);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/products(.*)",
  "/categories(.*)",
  "/search(.*)",
  "/cart(.*)",
  "/checkout(.*)",
  "/auth(.*)",
  "/about",
  "/contact",
  "/help",
  "/wishlist",
  "/api/products(.*)",
  "/api/categories(.*)",
  "/api/search(.*)",
  "/api/cart(.*)",
  "/api/checkout(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  // Get route protection configuration
  const protection = getRouteProtection(pathname);

  // Check if route requires authentication
  if (protection.requireAuth && !userId) {
    const redirectUrl = protection.redirectTo || "/auth/sign-in";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // If user is authenticated, check role and permission requirements
  if (userId && sessionClaims) {
    const publicMetadata = sessionClaims.publicMetadata as any || {};
    const userRole = publicMetadata.role as UserRole || UserRole.USER;
    const isActive = publicMetadata.isActive !== false;

    // Check if user account is active
    if (!isActive) {
      return NextResponse.redirect(new URL("/auth/sign-in?error=inactive", req.url));
    }

    // Check role requirements
    if (protection.allowedRoles && !protection.allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Check permission requirements
    if (protection.allowedPermissions) {
      const userPermissions = publicMetadata.permissions as UserPermission[] || [];
      const hasRequiredPermission = protection.allowedPermissions.some(permission => 
        userPermissions.includes(permission)
      );
      
      if (!hasRequiredPermission) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Special handling for dashboard routes - admin only
    if (pathname.startsWith("/dashboard") && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Special handling for admin API routes
    if (pathname.startsWith("/api/users") && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
  }

  // For protected routes, ensure user is authenticated
  if (isProtectedRoute(req)) {
    await auth.protect();
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
