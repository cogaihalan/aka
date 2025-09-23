import { NextRequest } from "next/server";
import { 
  withAdminAuth, 
  createSuccessResponse, 
  createErrorResponse
} from "@/lib/auth/api-protection";
import { 
  UserRole, 
  CreateUserPayload, 
  AuthApiResponse 
} from "@/types/auth";
import { ClerkUserService } from "@/lib/clerk/client";

/**
 * GET /api/users - Get all users (admin only)
 */
export const GET = withAdminAuth(async (user, req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role") as UserRole | null;
    const search = searchParams.get("search") || "";

    const response = await ClerkUserService.getUsers({
      page,
      limit,
      role: role || undefined,
      search: search || undefined,
    });

    return createSuccessResponse(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    return createErrorResponse("Failed to fetch users", 500);
  }
});

/**
 * POST /api/users - Create new user (admin only)
 */
export const POST = withAdminAuth(async (user, req: NextRequest) => {
  try {
    const body: CreateUserPayload = await req.json();
    
    // Validate required fields
    if (!body.email || !body.role) {
      return createErrorResponse("Email and role are required", 400);
    }

    // Validate role
    if (!Object.values(UserRole).includes(body.role)) {
      return createErrorResponse("Invalid role", 400);
    }

    const newUser = await ClerkUserService.createUser(body);
    return createSuccessResponse(newUser, "User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    return createErrorResponse("Failed to create user", 500);
  }
});
