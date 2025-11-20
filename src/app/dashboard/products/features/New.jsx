"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().gt(0, 'Price must be at least 0'),
  stock: z.coerce.number().gt(0, 'Stock must be at least 0').optional(),
  barcode: z.string().min(1, 'Barcode is required').optional(),
  description: z.string(),
  category: z.string().min(1, 'Category is required').optional(),

});
import React from "react";
import axiosInstance from "@/lib/axios";
import { Loader2 } from "lucide-react";

export const New = ({ item = null, onSuccess, isOpen }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  

    const form =
      useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          barcode: '',
          category: '',
        }
        })

  // If item is provided, set form values to item values
   useEffect(() => {
     if (!isOpen) return;
     if (item) {
       form.reset({
         name: item.name || "",
         price: item.price || 0,
         stock: item.stock || 0,
         barcode: item.barcode || "",
         description: item.description || "",
         category: item.category?.documentId || ''
       });
     } else {
       form.reset({
         name: "",
         price: 0,
         stock: 0,
         barcode: "",
         description: "",
          category: ''
       });
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [item, isOpen]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
        
      } finally {
        setCategoriesLoading(false);
      }
    }
    if (isOpen) fetchCategories();
    
  }, [isOpen])
      
  async function onSubmit(values) {
    setIsLoading(true)

    if (item?.id) {
      await axiosInstance.put(`/api/products/${item.documentId}`, {
        ...values,
        category: values.category 
      })
    } else {
      await axiosInstance.post('/api/products', {
        ...values,
        category: values.category
      })
    }


    if (onSuccess) onSuccess()
    
    setIsLoading(false)

    toast.success("Products created successfully!");
       

       
     }
        
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{item?.id ? "Edit" : "Add a new"} Product?</SheetTitle>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8  px-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="product name" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  {categoriesLoading ? (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Loading categories...</span>
                    </div>
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.documentId}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product Price"
                    step="0.01"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Stock" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <FormControl>
                  <Input placeholder="Product Barcode" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Category description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </SheetContent>
  );
};
