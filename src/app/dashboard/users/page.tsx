import { Metadata } from "next";
import { UserManagement } from "@/features/users/components/user-management";
import PageContainer from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "User Management | AKA Store Dashboard",
  description: "Manage user accounts, roles, and permissions",
};

export default function UsersPage() {
  return (
    <PageContainer>
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions for your store.
          </p>
        </div>
        <UserManagement />
      </div>
    </PageContainer>
  );
}
