"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import CustomImage from '@/components/ui/CustomImage';
import { Product } from '@/types/product';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(params.id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/products')}
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-600 mb-6 flex items-center"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <CustomImage
              src={product.image}
              alt={product.name}
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.category}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <Badge variant="default" className="text-sm">
                  {product.stock} in stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-sm">
                  Out of stock
                </Badge>
              )}
            </div>

            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>

            <AddToCartButton
              productId={product._id}
              stock={product.stock}
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 