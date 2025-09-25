import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./user-tables/columns";
import { unifiedUserService } from "@/lib/api";
import { UserRole } from "@/types/auth";

type UserListingPage = {};

export default async function UserListingPage({}: UserListingPage) {
  // Get search params using the same pattern as products and categories
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const role = searchParamsCache.get("role") as UserRole | undefined;

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(role && { role }),
  };

  // Fetch users from API using the same pattern
  const data = await unifiedUserService.getUsers(filters);
  const totalUsers = data.total;
  const users = data.users;

  return (
    <DataTableWrapper
      data={users}
      totalItems={totalUsers}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
