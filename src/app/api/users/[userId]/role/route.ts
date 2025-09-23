import { NextRequest } from "next/server";
import { 
  withAdminAuth, 
  createSuccessResponse, 
  createErrorResponse 
} from "@/lib/auth/api-protection";
import { 
  UserRole, 
  AuthApiResponse 
} from "@/types/auth";
import { ClerkUserService } from "@/lib/clerk/client";

interface RouteContext {
  params: Promise<{
    userId: string;
  }>;
}

/**
 * PUT /api/users/[userId]/role - Update user role (admin only)
 */
export const PUT = withAdminAuth(async (user, req: NextRequest, context: RouteContext) => {
  try {
    const { userId } = await context.params;
    const body = await req.json();
    const { role } = body;

    // Validate role
    if (!role || !Object.values(UserRole).includes(role)) {
      return createErrorResponse("Invalid role", 400);
    }

    // Prevent admin from changing their own role
    if (user.id === userId) {
      return createErrorResponse("Cannot change your own role", 400);
    }

    const updatedUser = await ClerkUserService.updateUserRole(userId, role);
    return createSuccessResponse(updatedUser, "User role updated successfully");
  } catch (error) {
    console.error("Error updating user role:", error);
    return createErrorResponse("Failed to update user role", 500);
  }
});
