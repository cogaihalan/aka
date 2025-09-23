import { clerkClient } from "@clerk/nextjs/server";
import { 
  UserRole, 
  UserPermission, 
  ROLE_PERMISSIONS, 
  AppUser, 
  CreateUserPayload, 
  UpdateUserPayload,
  UserListResponse,
  ClerkUserMetadata
} from "@/types/auth";

/**
 * Clerk API service for user management
 */
export class ClerkUserService {
  /**
   * Get all users with pagination and filtering
   */
  static async getUsers(options: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  } = {}): Promise<UserListResponse> {
    const { page = 1, limit = 10, role, search } = options;
    
    try {
      // Get users from Clerk
      const client = await clerkClient();
      const users = await client.users.getUserList({
        limit: limit * 2, // Get more to filter
        offset: (page - 1) * limit,
      });

      // Filter users based on criteria
      let filteredUsers = users.data.map(user => this.clerkUserToAppUser(user));

      // Filter by role
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(searchLower) ||
          user.fullName?.toLowerCase().includes(searchLower) ||
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        limit,
        hasMore: endIndex < filteredUsers.length,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<AppUser | null> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      return this.clerkUserToAppUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  /**
   * Create new user
   */
  static async createUser(payload: CreateUserPayload): Promise<AppUser> {
    try {
      const metadata: ClerkUserMetadata = {
        role: payload.role,
        isActive: true,
        permissions: ROLE_PERMISSIONS[payload.role],
      };

      const client = await clerkClient();
      const user = await client.users.createUser({
        emailAddress: [payload.email],
        firstName: payload.firstName,
        lastName: payload.lastName,
        publicMetadata: metadata,
        skipPasswordChecks: true, // Admin creates user, they'll set password later
        skipPasswordRequirement: true,
      });

      return this.clerkUserToAppUser(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, payload: UpdateUserPayload): Promise<AppUser> {
    try {
      const client = await clerkClient();
      const currentUser = await client.users.getUser(userId);
      const currentMetadata = currentUser.publicMetadata as ClerkUserMetadata;
      
      const updatedMetadata: ClerkUserMetadata = {
        ...currentMetadata,
        role: payload.role || currentMetadata.role,
        isActive: payload.isActive !== undefined ? payload.isActive : currentMetadata.isActive,
        permissions: payload.role ? ROLE_PERMISSIONS[payload.role] : currentMetadata.permissions,
        ...payload.metadata,
      };

      const user = await client.users.updateUser(userId, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        publicMetadata: updatedMetadata,
      });

      return this.clerkUserToAppUser(user);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, role: UserRole): Promise<AppUser> {
    try {
      const client = await clerkClient();
      const currentUser = await client.users.getUser(userId);
      const currentMetadata = currentUser.publicMetadata as ClerkUserMetadata;
      
      const updatedMetadata: ClerkUserMetadata = {
        ...currentMetadata,
        role,
        permissions: ROLE_PERMISSIONS[role],
      };

      const user = await client.users.updateUser(userId, {
        publicMetadata: updatedMetadata,
      });

      return this.clerkUserToAppUser(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Failed to update user role");
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.deleteUser(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }

  /**
   * Ban user (deactivate)
   */
  static async banUser(userId: string): Promise<AppUser> {
    try {
      const client = await clerkClient();
      const user = await client.users.banUser(userId);
      return this.clerkUserToAppUser(user);
    } catch (error) {
      console.error("Error banning user:", error);
      throw new Error("Failed to ban user");
    }
  }

  /**
   * Unban user (activate)
   */
  static async unbanUser(userId: string): Promise<AppUser> {
    try {
      const client = await clerkClient();
      const user = await client.users.unbanUser(userId);
      return this.clerkUserToAppUser(user);
    } catch (error) {
      console.error("Error unbanning user:", error);
      throw new Error("Failed to unban user");
    }
  }

  /**
   * Convert Clerk user to App user
   */
  private static clerkUserToAppUser(clerkUser: any): AppUser {
    const metadata = clerkUser.publicMetadata as ClerkUserMetadata;
    const role = metadata?.role || UserRole.USER;
    const permissions = ROLE_PERMISSIONS[role];

    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      fullName: clerkUser.fullName || undefined,
      imageUrl: clerkUser.imageUrl || undefined,
      role,
      permissions,
      isActive: !clerkUser.banned && metadata?.isActive !== false,
      createdAt: new Date(clerkUser.createdAt),
      updatedAt: new Date(clerkUser.updatedAt),
      lastSignInAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt) : undefined,
      metadata: metadata || {},
    };
  }
}
