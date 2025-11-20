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


const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().gt(0, 'Price must be at least 0'),
  stock: z.coerce.number().gt(0, 'Stock must be at least 0').optional(),
  barcode: z.string().min(1, 'Barcode is required').optional(),
  description: z.string()

});
import React from "react";
import axiosInstance from "@/lib/axios";

export const New = ({ item = null, onSuccess, isOpen }) => {
  const [isLoading, setIsLoading] = useState(false)
  

    const form =
      useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          barcode: ''
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
       });
     } else {
       form.reset({
         name: "",
         price: 0,
         stock: 0,
         barcode: "",
         description: "",
       });
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [item, isOpen]);
      
  async function onSubmit(values) {
    setIsLoading(true)

    if (item?.id) {
      await axiosInstance.put(`/api/products/${item.documentId}`, {data: values})
    } else {
      await axiosInstance.post('/api/products', {data: values})
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
