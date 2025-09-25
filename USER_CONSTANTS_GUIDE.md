# User Constants Development Guide

This guide explains how to use the user email constants for development and testing without external API calls.

## Files Created

- `src/constants/users.ts` - Main constants file with user data and helper functions
- `src/constants/users-example.ts` - Usage examples and patterns
- `src/lib/api/services/unified/users.ts` - Updated with helper methods

## Quick Start

### Import the constants you need:

```typescript
import { 
  ALL_DEV_USERS,
  ADMIN_USERS,
  REGULAR_USERS,
  getUserByEmail,
  getUsersByRole,
  DEV_USER_CONSTANTS
} from "@/constants/users";
```

### Basic Usage Examples

#### 1. Get all users
```typescript
const allUsers = ALL_DEV_USERS;
```

#### 2. Get users by role
```typescript
const adminUsers = getUsersByRole(UserRole.ADMIN);
const regularUsers = getUsersByRole(UserRole.USER);
```

#### 3. Get specific user by email
```typescript
const user = getUserByEmail("admin@aka.com");
```

#### 4. Quick access to specific users
```typescript
const primaryAdmin = DEV_USER_CONSTANTS.ADMIN.PRIMARY;
const premiumUser = DEV_USER_CONSTANTS.USER.PREMIUM;
const testUser = DEV_USER_CONSTANTS.TEST.GENERAL;
```

#### 5. Get random users for testing
```typescript
const randomUsers = getRandomUsers(5); // Get 5 random users
```

## Available User Data

### Admin Users
- `admin@aka.com` - Main administrator
- `john.admin@aka.com` - Secondary admin
- `sarah.manager@aka.com` - Manager account

### Regular Users
- `olivia.martin@email.com` - Premium customer
- `jackson.lee@email.com` - Frequent buyer
- `isabella.nguyen@email.com` - New customer
- `will@email.com` - VIP customer
- `sofia.davis@email.com` - Regular customer
- `michael.brown@email.com` - Tech enthusiast
- `emma.wilson@email.com` - Fashion lover
- `alex.garcia@email.com` - Inactive user

### Test Users
- `test.user@aka.com` - General testing
- `demo@aka.com` - Demo account
- `qa.test@aka.com` - QA testing

## Helper Functions

### Email Validation
```typescript
import { isValidDevEmail, isAdminEmail, isUserEmail } from "@/constants/users";

// Check if email is valid for development
const isValid = isValidDevEmail("admin@aka.com");

// Check if email belongs to admin
const isAdmin = isAdminEmail("admin@aka.com");

// Check if email belongs to regular user
const isUser = isUserEmail("olivia.martin@email.com");
```

### User Filtering
```typescript
import { getActiveUsers, getInactiveUsers } from "@/constants/users";

// Get only active users
const activeUsers = getActiveUsers();

// Get only inactive users
const inactiveUsers = getInactiveUsers();
```

## Service Integration

The `unifiedUserService` has been updated with helper methods:

```typescript
import { unifiedUserService } from "@/lib/api/services/unified/users";

// Get all dev users
const allUsers = unifiedUserService.getDevUsers();

// Get users by role
const adminUsers = unifiedUserService.getDevUsersByRole(UserRole.ADMIN);

// Check email types
const isAdmin = unifiedUserService.isDevAdminEmail("admin@aka.com");
const isUser = unifiedUserService.isDevUserEmail("olivia.martin@email.com");

// Get random users
const randomUsers = unifiedUserService.getDevRandomUsers(3);
```

## Common Use Cases

### 1. Form Validation
```typescript
function validateUserForm(email: string, role: UserRole) {
  if (!isValidDevEmail(email)) {
    return { error: "Please use a valid development email" };
  }
  
  if (role === UserRole.ADMIN && !isAdminEmail(email)) {
    return { error: "Admin role requires an admin email" };
  }
  
  return { valid: true };
}
```

### 2. Populate Dropdowns
```typescript
// For user selection dropdown
const userOptions = ALL_DEV_USERS.map(user => ({
  value: user.id,
  label: `${user.firstName} ${user.lastName}`,
  email: user.email
}));
```

### 3. Authentication Simulation
```typescript
function simulateLogin(email: string) {
  const user = getUserByEmail(email);
  
  if (!user || !user.isActive) {
    return { success: false, message: "Invalid user" };
  }
  
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`
    }
  };
}
```

### 4. Testing Different User Scenarios
```typescript
// Test admin functionality
const adminUser = DEV_USER_CONSTANTS.ADMIN.PRIMARY;

// Test regular user functionality
const regularUser = DEV_USER_CONSTANTS.USER.PREMIUM;

// Test inactive user
const inactiveUser = DEV_USER_CONSTANTS.USER.INACTIVE;
```

## Benefits

1. **No External API Required** - All user data is available locally
2. **Consistent Testing** - Same users across all development sessions
3. **Role-Based Testing** - Easy to test different user permissions
4. **Quick Development** - No need to create users manually
5. **Realistic Data** - Users have realistic names, emails, and avatars

## Adding New Users

To add new users, edit `src/constants/users.ts` and add them to the appropriate array:

```typescript
// Add to ADMIN_USERS, REGULAR_USERS, or TEST_USERS
export const NEW_USERS: DevUser[] = [
  {
    id: "new-user-1",
    email: "new.user@example.com",
    firstName: "New",
    lastName: "User",
    role: UserRole.USER,
    isActive: true,
    avatar: "https://example.com/avatar.png",
    description: "New user for testing"
  }
];
```

Then update the `ALL_DEV_USERS` array to include your new users.

## Tips

1. Use `DEV_USER_CONSTANTS` for quick access to specific users
2. Use `getRandomUsers()` for testing with different user combinations
3. Use email validation helpers to ensure you're using valid development emails
4. Check the `users-example.ts` file for more detailed usage patterns
