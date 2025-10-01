"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { CustomPage } from "@/types/page";
import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle, Home, FileText, Calendar } from "lucide-react";
import { CellAction } from "./cell-action";
import { format } from "date-fns";

export const columns: ColumnDef<CustomPage>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }: { column: Column<CustomPage, unknown> }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const page = row.original;
      return (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium">{page.title}</div>
            <div className="text-sm text-muted-foreground">/{page.slug}</div>
          </div>
          {page.isHomepage && (
            <Badge variant="secondary" className="text-xs">
              <Home className="h-3 w-3 mr-1" />
              Homepage
            </Badge>
          )}
        </div>
      );
    },
    meta: {
      label: "title",
      placeholder: "Search pages...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "published" | "draft";
      return (
        <div className="flex items-center space-x-2">
          {status === "published" ? (
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Published
            </Badge>
          ) : (
            <Badge variant="secondary">
              <XCircle className="h-3 w-3 mr-1" />
              Draft
            </Badge>
          )}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
    },
  },
  {
    id: "metaTitle",
    accessorKey: "metaTitle",
    header: "SEO Title",
    cell: ({ row }) => {
      const metaTitle = row.getValue("metaTitle") as string;
      return (
        <div className="max-w-[200px] truncate">
          {metaTitle || <span className="text-muted-foreground">No SEO title</span>}
        </div>
      );
    },
  },
  {
    id: "author",
    accessorKey: "authorName",
    header: "Author",
    cell: ({ row }) => {
      const authorName = row.getValue("authorName") as string;
      return <div className="text-sm">{authorName}</div>;
    },
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }: { column: Column<CustomPage, unknown> }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as Date;
      return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(updatedAt), "MMM dd, yyyy")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
