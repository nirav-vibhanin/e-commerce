"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (status === "loading") return null;
  if (status === "unauthenticated" || session?.user.role !== "admin") {
    if (typeof window !== "undefined") router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createProduct(data);
      toast.success("Product created successfully!");
      router.push("/admin-dashboard/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create product.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-2 min-h-[80vh]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Create New Product</h1>
          <p className="text-lg text-gray-600">Fill in the details below to add a new product to the system.</p>
        </div>
        <div className="w-full">
          <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
} 