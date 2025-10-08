"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Product } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle } from "lucide-react";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { CATEGORY_OPTIONS } from "./options";

export const columns: ColumnDef<Product>[] = [
  {
    id: "photo_url",
    accessorKey: "photo_url",
    header: "IMAGE",
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square">
          <Image
            src={row.getValue("photo_url")}
            alt={row.getValue("name")}
            fill
            className="rounded-lg"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Product["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search products...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "category",
    accessorKey: "primaryCategory",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const primaryCategory = product.primaryCategory;

      return (
        <Badge variant="outline" className="capitalize">
          {primaryCategory?.name || "Uncategorized"}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "categories",
      variant: "multiSelect",
      options: CATEGORY_OPTIONS,
    },
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <div className="font-medium">${price?.toFixed(2) || "0.00"}</div>;
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[200px] truncate text-sm text-muted-foreground">
          {description || "No description"}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
