"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { getOrderById, cancelOrder } from "@/lib/api";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const getStatusColor = (status: Order['orderStatus']) => {
  switch (status) {
    case 'Cancelled':
      return 'destructive';
    case 'Delivered':
      return 'success';
    case 'Processing':
      return 'warning';
    case 'Shipped':
      return 'info';
    default:
      return 'default';
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(params.id as string);
        setOrder(data);
        setError(null);
      } catch (error: any) {
        setError(error.message || "Failed to fetch order");
        toast.error(error.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router, status]);

  const handleCancelOrder = async () => {
    if (!order) return;
    
    try {
      await cancelOrder(order._id);
      toast.success("Order cancelled successfully");
      const updatedOrder = await getOrderById(order._id);
      setOrder(updatedOrder);
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            {error || "Order not found"}
          </h2>
          <Button onClick={() => router.push('/dashboard/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
        </div>
        <Badge variant={getStatusColor(order.orderStatus)}>
          {order.orderStatus}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.product} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">${order.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">${order.shippingCost.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Tax</p>
                <p className="font-medium">${order.tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="font-semibold">Total</p>
                <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Address:</span> {order.shippingAddress.street}</p>
              <p><span className="font-medium">City:</span> {order.shippingAddress.city}</p>
              <p><span className="font-medium">State:</span> {order.shippingAddress.state}</p>
              <p><span className="font-medium">Zip Code:</span> {order.shippingAddress.zipCode}</p>
              <p><span className="font-medium">Country:</span> {order.shippingAddress.country}</p>
              <p><span className="font-medium">Phone:</span> {order.shippingAddress.phone}</p>
            </div>
          </CardContent>
        </Card>

        {order.orderStatus === "Pending" && (
          <Button 
            variant="destructive" 
            onClick={handleCancelOrder}
            className="w-full sm:w-auto"
          >
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  );
} 