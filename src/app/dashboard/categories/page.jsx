'use client'

import React, { useEffect, useState } from 'react'
import { DataTable } from './features/data-table';
// import { columns } from './features/columns';
import { getColumns } from './features/columns';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Page = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [filters, setFilters] = useState({name: "", description: ""})

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildQuery = () => {
    let query = new URLSearchParams()
    query.set('pagination[page]', page)
    query.set('pagination[pageSize]', pageSize)
    // check for filters and description

    if (filters.name) {
      query.set('filters[name][$containsi]', filters.name)
    }
  
    if(filters.description) {
      query.set('filters[description][$containsi]', filters.description)
    }

    return query.toString()
  }

  const columns = getColumns(filters, handleFilterChange);


//   const data = [
//   {
//     id: "728ed52f",
//     amount: 100,
//     status: "pending",
//   },
//   {
//     id: "489e1d42",
//     email: "m@example.com",
//     amount: 125,
//     status: "processing",
//     email: "example@gmail.com",
//   },
//   // ...
// ]

   useEffect(() => {
     axiosInstance
       .get(`/api/categories?${buildQuery()}`)
       .then((response) => {
         const apiData = response.data.data.map((item) => ({
           id: item.id,
           name: item.name,
           description: item.description,
           documentId: item.documentId,
         }));
         setCategories(apiData);
         setMeta(response.data.meta.pagination);
         
       })
       .catch((error) => {
         console.log("Failed to fetch categories:", error);
       })
       .finally(() => setIsLoading(false));
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [page, pageSize, filters]);

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value))
    setPage(1)
   }

  return (
    <div className="py-4 md:py-6 px-4 lg:py-6">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            <span>List of categories</span>
          </CardDescription>

          <CardAction>
            <Button>Add a new record</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-3 mx-auto text-sm text-muted-foreground">
              Loading .....
            </p>
          ) : (
            <DataTable columns={columns} data={categories} />
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            {meta && (
              <>
                {categories.length === 0
                  ? "No rows"
                  : `Showing ${(meta.page - 1) * meta.pageSize + 1} to ${
                      (meta.page - 1) * meta.pageSize + categories.length
                    } of ${meta.total} rows`}
              </>
            )}
            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                </SelectContent>
              </Select>
              <span>Rows per page</span>
            </div>
            <span className="whitespace-nowrap">
              Page {meta?.page} of {meta?.pageCount}
            </span>
            {/* pagination buttons */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                «
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, meta?.pageCount || 1))
                }
                disabled={page === meta?.pageCount}
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(meta?.pageCount)}
                disabled={page === meta?.pageCount}
              >
                »
              </Button>
              </div>
          </div>
          {/*  */}
        </CardContent>
      </Card>
    </div>
  );
}

export default Page