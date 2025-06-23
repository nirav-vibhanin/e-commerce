import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OrderSummaryProps {
  items: {
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.product._id} className="py-2 flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Subtotal</p>
              <p className="font-semibold">${total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="font-semibold">Shipping</p>
              <p className="text-gray-500">Free</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 