import React from 'react';
import { Card, CardContent, CardFooter } from './card';
import CustomImage from './CustomImage';
import { AddToCartButton } from './AddToCartButton';
import Link from 'next/link';
import { Badge } from './badge';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductCard({ product, isAdmin, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200 flex flex-col h-full max-w-[300px] mx-auto">
      <Link href={`/products/${product._id}`} className="flex-none">
        <div className="relative w-full pt-[100%] bg-gray-100">
          <CustomImage
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4"
          />
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 pb-2">
          <div className="space-y-0.5">
            <h3 className="font-medium text-sm line-clamp-2 min-h-[32px] group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
              <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-300 rounded">{product.category}</Badge>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2 mt-auto">
        {isAdmin ? (
          <div className="flex gap-2 w-full">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <AddToCartButton
            productId={product._id}
            stock={product.stock}
            className="w-full"
          />
        )}
      </CardFooter>
    </Card>
  );
} 