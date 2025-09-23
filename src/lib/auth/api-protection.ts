import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  UserRole, 
  UserPermission, 
  AuthApiResponse,
  AuthError,
  PermissionError,
  RoleError
} from "@/types/auth";
import { 
  clerkUserToAppUser, 
  validateUserAccess,
  createAuthError,
  createPermissionError,
  createRoleError
} from "@/lib/auth/utils";

/**
 * API protection decorator for server actions
 */
export function withAuth<T extends any[], R>(
  handler: (user: any, ...args: T) => Promise<R>,
  options?: {
    requiredPermission?: UserPermission;
    requiredRole?: UserRole;
    allowGuests?: boolean;
  }
) {
  return async (...args: T): Promise<R> => {
    try {
      const { userId } = await auth();
      
      if (!userId && !options?.allowGuests) {
        throw createAuthError("Authentication required", "AUTH_REQUIRED");
      }

      if (userId) {
        const user = await currentUser();
        if (!user) {
          throw createAuthError("User not found", "USER_NOT_FOUND");
        }

        const appUser = clerkUserToAppUser(user);
        validateUserAccess(appUser, options?.requiredPermission, options?.requiredRole);
        
        return await handler(appUser, ...args);
      }

      return await handler(null, ...args);
    } catch (error) {
      if (error instanceof AuthError || error instanceof PermissionError || error instanceof RoleError) {
        throw error;
      }
      throw createAuthError("Authentication failed", "AUTH_FAILED");
    }
  };
}

/**
 * API route protection middleware
 */
export function withApiAuth<T extends any[], R>(
  handler: (req: NextRequest, user: any, context: any, ...args: T) => Promise<NextResponse<R>>,
  options?: {
    requiredPermission?: UserPermission;
    requiredRole?: UserRole;
    allowGuests?: boolean;
  }
) {
  return async (req: NextRequest, context: any, ...args: T): Promise<NextResponse<R | AuthApiResponse>> => {
    try {
      const { userId } = await auth();
      
      if (!userId && !options?.allowGuests) {
        return NextResponse.json(
          { success: false, error: "Authentication required" } as AuthApiResponse,
          { status: 401 }
        );
      }

      if (userId) {
        const user = await currentUser();
        if (!user) {
          return NextResponse.json(
            { success: false, error: "User not found" } as AuthApiResponse,
            { status: 404 }
          );
        }

        const appUser = clerkUserToAppUser(user);
        validateUserAccess(appUser, options?.requiredPermission, options?.requiredRole);
        
        return await handler(req, appUser, context, ...args);
      }

      return await handler(req, null, context, ...args);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { success: false, error: error.message } as AuthApiResponse,
          { status: error.statusCode }
        );
      }
      
      if (error instanceof PermissionError) {
        return NextResponse.json(
          { success: false, error: error.message } as AuthApiResponse,
          { status: error.statusCode }
        );
      }
      
      if (error instanceof RoleError) {
        return NextResponse.json(
          { success: false, error: error.message } as AuthApiResponse,
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: "Authentication failed" } as AuthApiResponse,
        { status: 500 }
      );
    }
  };
}

/**
 * Admin-only API protection
 */
export function withAdminAuth<T extends any[], R>(
  handler: (user: any, req: NextRequest, context: any, ...args: T) => Promise<NextResponse<R>>
) {
  return withApiAuth(handler, { requiredRole: UserRole.ADMIN });
}

/**
 * User-only API protection
 */
export function withUserAuth<T extends any[], R>(
  handler: (user: any, req: NextRequest, context: any, ...args: T) => Promise<NextResponse<R>>
) {
  return withApiAuth(handler, { requiredRole: UserRole.USER });
}

/**
 * Permission-based API protection
 */
export function withPermissionAuth<T extends any[], R>(
  permission: UserPermission,
  handler: (user: any, req: NextRequest, context: any, ...args: T) => Promise<NextResponse<R>>
) {
  return withApiAuth(handler, { requiredPermission: permission });
}

/**
 * Dashboard API protection (admin only)
 */
export function withDashboardAuth<T extends any[], R>(
  handler: (user: any, req: NextRequest, context: any, ...args: T) => Promise<NextResponse<R>>
) {
  return withApiAuth(handler, { 
    requiredPermission: UserPermission.ACCESS_DASHBOARD 
  });
}

/**
 * Storefront API protection (authenticated users)
 */
export function withStorefrontAuth<T extends any[], R>(
  handler: (user: any, req: NextRequest, context: any, ...args: T) => Promise<NextResponse<R>>
) {
  return withApiAuth(handler, { 
    requiredPermission: UserPermission.VIEW_PRODUCTS 
  });
}

/**
 * Get current user from API context
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  return clerkUserToAppUser(user);
}

/**
 * Check if current user has permission
 */
export async function hasCurrentUserPermission(permission: UserPermission): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || !user.isActive) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if current user has role
 */
export async function hasCurrentUserRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || !user.isActive) return false;
  return user.role === role;
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return hasCurrentUserRole(UserRole.ADMIN);
}

/**
 * Check if current user can access dashboard
 */
export async function canCurrentUserAccessDashboard(): Promise<boolean> {
  return hasCurrentUserPermission(UserPermission.ACCESS_DASHBOARD);
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string, 
  statusCode: number = 400
): NextResponse<AuthApiResponse> {
  return NextResponse.json(
    { success: false, error: message } as AuthApiResponse,
    { status: statusCode }
  );
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data: T, 
  message?: string
): NextResponse<AuthApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, message } as AuthApiResponse<T>,
    { status: 200 }
  );
}
