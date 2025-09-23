import { NextRequest } from "next/server";
import { 
  withAdminAuth, 
  createSuccessResponse, 
  createErrorResponse 
} from "@/lib/auth/api-protection";
import { 
  UserRole, 
  UpdateUserPayload,
  AuthApiResponse 
} from "@/types/auth";
import { ClerkUserService } from "@/lib/clerk/client";

interface RouteContext {
  params: Promise<{
    userId: string;
  }>;
}

/**
 * GET /api/users/[userId] - Get user by ID (admin only)
 */
export const GET = withAdminAuth(async (user, req: NextRequest, context: RouteContext) => {
  try {
    const { userId } = await context.params;

    const userData = await ClerkUserService.getUserById(userId);
    if (!userData) {
      return createErrorResponse("User not found", 404);
    }

    return createSuccessResponse(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return createErrorResponse("Failed to fetch user", 500);
  }
});

/**
 * PUT /api/users/[userId] - Update user (admin only)
 */
export const PUT = withAdminAuth(async (user, req: NextRequest, context: RouteContext) => {
  try {
    const { userId } = await context.params;
    const body: UpdateUserPayload = await req.json();

    // Validate role if provided
    if (body.role && !Object.values(UserRole).includes(body.role)) {
      return createErrorResponse("Invalid role", 400);
    }

    const updatedUser = await ClerkUserService.updateUser(userId, body);
    return createSuccessResponse(updatedUser, "User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return createErrorResponse("Failed to update user", 500);
  }
});

/**
 * DELETE /api/users/[userId] - Delete user (admin only)
 */
export const DELETE = withAdminAuth(async (user, req: NextRequest, context: RouteContext) => {
  try {
    const { userId } = await context.params;

    // Prevent admin from deleting themselves
    if (user.id === userId) {
      return createErrorResponse("Cannot delete your own account", 400);
    }

    await ClerkUserService.deleteUser(userId);
    return createSuccessResponse(null, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return createErrorResponse("Failed to delete user", 500);
  }
});
