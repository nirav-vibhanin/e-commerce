import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import CustomImage from '../ui/CustomImage';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Product } from '@/types/product';

interface AdminProductCardProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AdminProductCard({ product, onEdit, onDelete }: AdminProductCardProps) {
  return (
    <Card className="w-full h-full flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link href={`/admin-dashboard/products/${product._id}`} className="flex-none">
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          <CustomImage
            src="/assets/images/image2.jpg"
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
        </div>
      </Link>

      <CardContent className="flex-grow p-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-sm line-clamp-1 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <Badge className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600">
              {product.category}
            </Badge>
          </div>
          <p className="text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
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
      </CardFooter>
    </Card>
  );
} 