import { UserRole } from "@/types/auth";

/**
 * Development User Constants
 * 
 * This file contains sample user data for development and testing purposes.
 * Use these constants to easily test different user scenarios without external API calls.
 */

export interface DevUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  description?: string;
}

// Admin Users
export const ADMIN_USERS: DevUser[] = [
  {
    id: "admin-1",
    email: "admin@aka.com",
    firstName: "Admin",
    lastName: "User",
    role: UserRole.ADMIN,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/admin.png",
    description: "Main administrator account"
  },
  {
    id: "admin-2",
    email: "john.admin@aka.com",
    firstName: "John",
    lastName: "Admin",
    role: UserRole.ADMIN,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/admin2.png",
    description: "Secondary admin account"
  },
  {
    id: "admin-3",
    email: "sarah.manager@aka.com",
    firstName: "Sarah",
    lastName: "Manager",
    role: UserRole.ADMIN,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/manager.png",
    description: "Manager account"
  }
];

// Regular Users
export const REGULAR_USERS: DevUser[] = [
  {
    id: "user-1",
    email: "olivia.martin@email.com",
    firstName: "Olivia",
    lastName: "Martin",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/1.png",
    description: "Premium customer"
  },
  {
    id: "user-2",
    email: "jackson.lee@email.com",
    firstName: "Jackson",
    lastName: "Lee",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/2.png",
    description: "Frequent buyer"
  },
  {
    id: "user-3",
    email: "isabella.nguyen@email.com",
    firstName: "Isabella",
    lastName: "Nguyen",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/3.png",
    description: "New customer"
  },
  {
    id: "user-4",
    email: "will@email.com",
    firstName: "William",
    lastName: "Kim",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/4.png",
    description: "VIP customer"
  },
  {
    id: "user-5",
    email: "sofia.davis@email.com",
    firstName: "Sofia",
    lastName: "Davis",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/5.png",
    description: "Regular customer"
  },
  {
    id: "user-6",
    email: "michael.brown@email.com",
    firstName: "Michael",
    lastName: "Brown",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/6.png",
    description: "Tech enthusiast"
  },
  {
    id: "user-7",
    email: "emma.wilson@email.com",
    firstName: "Emma",
    lastName: "Wilson",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/7.png",
    description: "Fashion lover"
  },
  {
    id: "user-8",
    email: "alex.garcia@email.com",
    firstName: "Alex",
    lastName: "Garcia",
    role: UserRole.USER,
    isActive: false,
    avatar: "https://api.slingacademy.com/public/sample-users/8.png",
    description: "Inactive user"
  }
];

// Test Users for specific scenarios
export const TEST_USERS: DevUser[] = [
  {
    id: "test-1",
    email: "test.user@aka.com",
    firstName: "Test",
    lastName: "User",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/test.png",
    description: "General testing account"
  },
  {
    id: "test-2",
    email: "demo@aka.com",
    firstName: "Demo",
    lastName: "Account",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/demo.png",
    description: "Demo account for presentations"
  },
  {
    id: "test-3",
    email: "qa.test@aka.com",
    firstName: "QA",
    lastName: "Tester",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://api.slingacademy.com/public/sample-users/qa.png",
    description: "Quality assurance testing"
  }
];

// All users combined
export const ALL_DEV_USERS: DevUser[] = [
  ...ADMIN_USERS,
  ...REGULAR_USERS,
  ...TEST_USERS
];

// Email lists for easy access
export const ADMIN_EMAILS = ADMIN_USERS.map(user => user.email);
export const USER_EMAILS = REGULAR_USERS.map(user => user.email);
export const TEST_EMAILS = TEST_USERS.map(user => user.email);
export const ALL_EMAILS = ALL_DEV_USERS.map(user => user.email);

// Helper functions
export const getUserByEmail = (email: string): DevUser | undefined => {
  return ALL_DEV_USERS.find(user => user.email === email);
};

export const getUsersByRole = (role: UserRole): DevUser[] => {
  return ALL_DEV_USERS.filter(user => user.role === role);
};

export const getActiveUsers = (): DevUser[] => {
  return ALL_DEV_USERS.filter(user => user.isActive);
};

export const getInactiveUsers = (): DevUser[] => {
  return ALL_DEV_USERS.filter(user => !user.isActive);
};

export const getRandomUser = (): DevUser => {
  const randomIndex = Math.floor(Math.random() * ALL_DEV_USERS.length);
  return ALL_DEV_USERS[randomIndex];
};

export const getRandomUsers = (count: number): DevUser[] => {
  const shuffled = [...ALL_DEV_USERS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Quick access to specific users
export const DEV_USER_CONSTANTS = {
  ADMIN: {
    PRIMARY: ADMIN_USERS[0],
    SECONDARY: ADMIN_USERS[1],
    MANAGER: ADMIN_USERS[2]
  },
  USER: {
    PREMIUM: REGULAR_USERS[0],
    FREQUENT: REGULAR_USERS[1],
    NEW: REGULAR_USERS[2],
    VIP: REGULAR_USERS[3],
    REGULAR: REGULAR_USERS[4],
    INACTIVE: REGULAR_USERS[7]
  },
  TEST: {
    GENERAL: TEST_USERS[0],
    DEMO: TEST_USERS[1],
    QA: TEST_USERS[2]
  }
} as const;

// Email validation helpers
export const isValidDevEmail = (email: string): boolean => {
  return ALL_EMAILS.includes(email);
};

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email);
};

export const isUserEmail = (email: string): boolean => {
  return USER_EMAILS.includes(email);
};

export const isTestEmail = (email: string): boolean => {
  return TEST_EMAILS.includes(email);
};
