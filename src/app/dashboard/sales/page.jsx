'use client'

import React, { useEffect, useState } from 'react'
import { DataTable } from './features/data-table';
import { getColumns } from './features/columns';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet } from '@/components/ui/sheet';

import { toast } from 'sonner';

const Page = () => {
  const [sales, setSales] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [filters, setFilters] = useState({ name: "", description: "" })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildQuery = () => {
    let query = new URLSearchParams()
    query.set('pagination[page]', page)
    query.set('pagination[pageSize]', pageSize)
    // check for filters and description

    
    if(filters.invoice_number) {
      query.set('filters[invoice_number][$eqi]', filters.invoice_number)
    }

    if (filters.customer_name) {
      query.set('filters[customer_name][$containsi]', filters.customer_name)
    }
    
    if (filters.customer_phone) {
      query.set('filters[customer_phone][$containsi]', filters.customer_phone)
    }
    if (filters.customer_email) {
      query.set('filters[customer_email][$containsi]', filters.customer_email)
    }
    
   

    return query.toString()
  }

 const fetchData = () => {
   setIsLoading(true);

   axiosInstance
     .get(`/api/sales?${buildQuery()}`)
     .then((response) => {
       setSales(response.data.data);
       setMeta(response.data.meta.pagination);
     })
     .catch((error) => {
       console.log("Failed to fetch categories:", error);
       toast.error("Failed to fetch categories");
     })
     .finally(() => setIsLoading(false));
 };

    useEffect(() => {
      fetchData();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, filters]);
  
      
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };


  
  const handleDelete = async (item) => {

    if (!confirm(`Are you sure you want to delete sale "${item.name}"?`)) return;

      try {
        await axiosInstance.delete(`/api/sales/${item.documentId}`);
        await fetchData();
        toast.success("Sale deleted successfully");
      } catch (error) {
        console.log("Failed to delete sale:", error);
        toast.error("Failed to delete sale");
      }
  };

  const columns = getColumns(
    filters,
    handleFilterChange,
    (item) => {
      setSelectedItem(item);
      setSheetOpen(true);
    },
    handleDelete
  );

   


  return (
    <div className="py-4 md:py-6 px-4 lg:py-6">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>
            <span>List of sales</span>
          </CardDescription>

          <CardAction>
            {/* <Button onClick={() => {
              setSelectedItem(null);
              setSheetOpen(true);
            }}>Add a new record</Button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <New item={selectedItem} isOpen={sheetOpen} onSuccess={() => {
                setSheetOpen(false)
                fetchData()
              }} />
            </Sheet> */}
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-3 mx-auto text-sm text-muted-foreground">
              Loading .....
            </p>
          ) : (
            <DataTable columns={columns} data={sales} />
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            {meta && (
              <>
                {sales.length === 0
                  ? "No rows"
                  : `Showing ${(meta.page - 1) * meta.pageSize + 1} to ${
                      (meta.page - 1) * meta.pageSize + sales.length
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