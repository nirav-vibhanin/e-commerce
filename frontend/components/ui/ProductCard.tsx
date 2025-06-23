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
    <Card className="w-full min-w-[200px] h-full flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link href={`/products/${product._id}`} className="flex-none">
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          <CustomImage
            src="/assets/images/image2.jpg"
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex-grow p-3">
        <div className="space-y-1">
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2rem] hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</p>
            <Badge className="text-[10px] px-1.5 py-0.5">{product.category}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        {isAdmin ? (
          <div className="flex gap-2 w-full">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="w-full">
            <AddToCartButton
              productId={product._id}
              stock={product.stock}
              className="w-full text-sm py-1"
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 