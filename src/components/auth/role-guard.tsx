"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole, UserPermission } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX, Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requiredPermission?: UserPermission;
  requiredPermissions?: UserPermission[];
  fallback?: ReactNode;
  showLoading?: boolean;
  showError?: boolean;
}

export function RoleGuard({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  fallback,
  showLoading = true,
  showError = true,
}: RoleGuardProps) {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    hasRole, 
    hasAnyRole, 
    hasPermission, 
    hasAnyPermission 
  } = useAuth();

  // Show loading state
  if (isLoading && showLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <Alert>
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You must be signed in to access this content.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <Alert>
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You need {requiredRole} role to access this content.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <Alert>
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You need one of the following roles: {requiredRoles.join(", ")}.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <Alert>
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You don't have the required permission: {requiredPermission}.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    if (fallback) return <>{fallback}</>;
    if (showError) {
      return (
        <Alert>
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You don't have any of the required permissions: {requiredPermissions.join(", ")}.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  // User has required access
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard requiredRole={UserRole.ADMIN} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function UserOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard requiredRole={UserRole.USER} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AuthenticatedOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback 
}: { 
  permission: UserPermission; 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredPermission={permission} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function DashboardAccess({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard 
      requiredPermission={UserPermission.ACCESS_DASHBOARD} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
