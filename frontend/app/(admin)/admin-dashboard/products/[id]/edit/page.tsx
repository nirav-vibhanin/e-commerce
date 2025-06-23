"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/api";
import { ProductForm } from "@/components/admin/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session.user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    getProductById(id)
      .then((data) => setProduct(data))
      .catch(() => {
        toast.error("Failed to fetch product data.");
        router.push("/admin-dashboard/products");
      })
      .finally(() => setIsFetching(false));
  }, [id, status, session, router]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await updateProduct(id, data);
      toast.success("Product updated successfully!");
      router.push("/admin-dashboard/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update product.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-2 min-h-[80vh]">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Edit Product</h1>
            <p className="text-lg text-gray-600">Update the details below to edit the product.</p>
          </div>
          <div className="w-full">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-2 min-h-[80vh]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Edit Product</h1>
          <p className="text-lg text-gray-600">Update the details below to edit the product.</p>
        </div>
        <div className="w-full">
          {product && (
            <ProductForm
              onSubmit={handleSubmit}
              defaultValues={product}
              isEditing
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
} 