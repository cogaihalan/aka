import { apiClient } from "@/lib/api/client-mock";
import type {
  AppUser,
  CreateUserPayload,
  UpdateUserPayload,
  UserRole,
  UserListResponse,
} from "@/types/auth";
import {
  ALL_DEV_USERS,
  getUserByEmail,
  getUsersByRole,
  getActiveUsers,
  getRandomUsers,
  DEV_USER_CONSTANTS,
  isValidDevEmail,
  isAdminEmail,
  isUserEmail,
} from "@/constants/users";
import { useServiceMethods } from "@/constants/users-example";

/**
 * Unified User Service
 * Provides user management functionality for both admin and storefront
 */
class UnifiedUserService {
  private basePath = "/api/users";

  /**
   * Get users with pagination and filtering
   */
  async getUsers(
    options: {
      page?: number;
      limit?: number;
      role?: UserRole;
      search?: string;
      isActive?: boolean;
    } = {}
  ): Promise<UserListResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.role) params.append("role", options.role);
    if (options.search) params.append("search", options.search);
    if (options.isActive !== undefined)
      params.append("isActive", options.isActive.toString());

    // const response = await apiClient.get(`/api/users?${params.toString()}`);

    // Apply filtering
    let filteredUsers = ALL_DEV_USERS;

    // Filter by role if specified
    if (options.role) {
      filteredUsers = filteredUsers.filter(
        (user) => user.role === options.role
      );
    }

    // Filter by search term if specified
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm) ||
          user.firstName?.toLowerCase().includes(searchTerm) ||
          user.lastName?.toLowerCase().includes(searchTerm) ||
          user.fullName?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by active status if specified
    if (options.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(
        (user) => user.isActive === options.isActive
      );
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    console.log("paginatedUsers", paginatedUsers);
    return {
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      hasMore: endIndex < filteredUsers.length,
    };
    // return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AppUser | null> {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  }

  /**
   * Create new user (admin only)
   */
  async createUser(userData: CreateUserPayload): Promise<AppUser> {
    const response = await apiClient.post("/api/users", userData);
    return response.data;
  }

  /**
   * Update user (admin only)
   */
  async updateUser(
    userId: string,
    userData: UpdateUserPayload
  ): Promise<AppUser> {
    const response = await apiClient.put(`/api/users/${userId}`, userData);
    return response.data;
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<AppUser> {
    const response = await apiClient.put(`/api/users/${userId}/role`, { role });
    return response.data;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/api/users/${userId}`);
  }

  /**
   * Development helper methods using constants
   */

  /**
   * Get all development users (for testing)
   */
  getDevUsers(): AppUser[] {
    return ALL_DEV_USERS;
  }

  /**
   * Get users by role from constants
   */
  getDevUsersByRole(role: UserRole): AppUser[] {
    return getUsersByRole(role);
  }

  /**
   * Get active users from constants
   */
  getDevActiveUsers(): AppUser[] {
    return getActiveUsers();
  }

  /**
   * Get random users for testing
   */
  getDevRandomUsers(count: number): AppUser[] {
    return getRandomUsers(count);
  }

  /**
   * Check if email is a valid development email
   */
  isDevEmail(email: string): boolean {
    return isValidDevEmail(email);
  }

  /**
   * Check if email belongs to admin
   */
  isDevAdminEmail(email: string): boolean {
    return isAdminEmail(email);
  }

  /**
   * Check if email belongs to regular user
   */
  isDevUserEmail(email: string): boolean {
    return isUserEmail(email);
  }

  /**
   * Get user by email from constants
   */
  getDevUserByEmail(email: string): AppUser | undefined {
    return getUserByEmail(email);
  }

  /**
   * Get specific user constants for quick access
   */
  getDevUserConstants() {
    return DEV_USER_CONSTANTS;
  }
}

export const unifiedUserService = new UnifiedUserService();
