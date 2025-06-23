"use client";
import React, { useEffect, useState } from "react";
import { getProducts, getProductCategories } from "@/lib/api";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const SORT_OPTIONS = {
  newest: "createdAt",
  price: "price",
  name: "name",
} as const;

const ORDER_OPTIONS = {
  desc: "desc",
  asc: "asc",
} as const;

type SortOption = keyof typeof SORT_OPTIONS;
type OrderOption = keyof typeof ORDER_OPTIONS;

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [order, setOrder] = useState<OrderOption>("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getProductCategories();
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts({
          search,
          category: category === "all" ? "" : category,
          sort: SORT_OPTIONS[sort],
          order: ORDER_OPTIONS[order],
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort, order]);

  const handleSortChange = (value: string) => {
    setSort(value as SortOption);
  };

  const handleOrderChange = (value: string) => {
    setOrder(value as OrderOption);
  };

  return (
    <div className="container mx-auto px-1 pt-2 pb-4">
      <div className="max-w-[1200px] mx-auto space-y-3">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-center md:text-left mb-2">Browse Products</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-2 bg-gray-50 p-3 rounded-lg mb-4">
            <div className="w-full md:w-auto flex-1">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue>
                    {category === "all" ? "All Categories" : category}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue>
                    {sort === "newest" ? "Newest" : 
                     sort === "price" ? "Price" : 
                     "Name"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select value={order} onValueChange={handleOrderChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue>
                    {order === "desc" ? "Descending" : "Ascending"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] relative">
                  <Skeleton className="absolute inset-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 