"use client"

import ColumnFilter from "@/components/ColumnFilter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import Image from "next/image"




export const getColumns = (filters, handleFilterChange, onEdit, onDelete) => [
 {
  accessorKey: "image",
  header: "Image",
  cell: ({ row }) => {
    const img = row.original.image?.formats?.thumbnail?.url;

    return (
      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {img ? (
          <Image
            src={process.env.NEXT_PUBLIC_STRAPI_URL + img}
            alt={row.original.name}
            width={50}
            height={50}
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="text-xs text-gray-500">No Image</span>
        )}
      </div>
    );
  },
},

  {
    accessorKey: "barcode",
    header: () => (
      <ColumnFilter
        label="Barcode"
        placeholder="Filter barcode ..."
        value={filters.barcode || ""}
        onChange={(val) => handleFilterChange("barcode", val)}
      />
    ),

    cell: (Info) => Info.getValue(),
  },
  {
    accessorKey: "name",
    header: () => (
      <ColumnFilter
        label="Name"
        placeholder="Filter name ..."
        value={filters.name || ""}
        onChange={(val) => handleFilterChange("name", val)}
      />
    ),

    cell: (Info) => Info.getValue(),
  },
  { accessorKey: "category.name", header: "Category" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "stock", header: "Stock" },

  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(row.original)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];