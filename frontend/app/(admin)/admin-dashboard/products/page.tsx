"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct } from "@/lib/api";
import { Product } from "@/types/product";
import { AdminProductCard } from "@/components/admin/AdminProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const AdminProductsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getProducts({}).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user.role !== "admin") {
      router.push("/dashboard");
    } else {
      fetchProducts();
    }
  }, [status, session, router, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully.");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Button 
          onClick={() => router.push("/admin-dashboard/products/new")}
          className="w-full sm:w-auto"
        >
          Create Product
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-full">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-2">Get started by creating a new product</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <AdminProductCard
              key={product._id}
              product={product}
              onEdit={() => router.push(`/admin-dashboard/products/${product._id}/edit`)}
              onDelete={() => handleDelete(product._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage; 