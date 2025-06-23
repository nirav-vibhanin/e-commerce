"use client";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProductCategories } from "@/lib/api";
import { Product } from "@/types/product";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0.01, "Price must be positive."),
  category: z.string().min(1, "Category is required."),
  brand: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock must be 0 or more."),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: SubmitHandler<FormValues>;
  defaultValues?: Partial<Product>;
  isEditing?: boolean;
  isLoading?: boolean;
}

const DEFAULT_CATEGORIES = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Other"];

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  defaultValues,
  isEditing = false,
  isLoading = false,
}) => {
  const [categories, setCategories] = React.useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(defaultValues?.category || DEFAULT_CATEGORIES[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      category: selectedCategory,
      isActive: defaultValues?.isActive ?? true,
      isFeatured: defaultValues?.isFeatured ?? false,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getProductCategories();
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
          if (!selectedCategory) {
            setSelectedCategory(res.data[0]);
            setValue('category', res.data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    fetchCategories();
  }, [selectedCategory, setValue]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setValue("category", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue>{selectedCategory}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register("brand")} />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={watch("isActive") ? "active" : "inactive"}
            onValueChange={(value) => setValue("isActive", value === "active")}
          >
            <SelectTrigger>
              <SelectValue>{watch("isActive") ? "Active" : "Inactive"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Featured</Label>
          <Select
            value={watch("isFeatured") ? "featured" : "not-featured"}
            onValueChange={(value) => setValue("isFeatured", value === "featured")}
          >
            <SelectTrigger>
              <SelectValue>{watch("isFeatured") ? "Yes" : "No"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Yes</SelectItem>
              <SelectItem value="not-featured">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>
      {/* Image upload can be added here in the future */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-black to-gray-800 text-white text-lg py-3 px-8 rounded-xl shadow-lg hover:from-gray-900 hover:to-black transition"
        >
          {isLoading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}; 