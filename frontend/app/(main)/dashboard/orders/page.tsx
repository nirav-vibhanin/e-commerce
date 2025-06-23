"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getOrders, cancelOrder } from "@/lib/api";
import { Order } from "@/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const getStatusColor = (status: Order['orderStatus'] | undefined) => {
  if (!status) return 'default';
  
  switch (status.toLowerCase()) {
    case 'cancelled':
      return 'destructive';
    case 'delivered':
      return 'success';
    case 'processing':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'shipped':
      return 'secondary';
    default:
      return 'default';
  }
};

export default function UserOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    loadOrders();
  }, [status, router, currentPage, selectedStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders({
        page: currentPage,
        limit: 10,
        orderStatus: selectedStatus === "all" ? undefined : selectedStatus
      });
      setOrders(res.data);
      setTotalPages(res.pagination.pages);
      setTotalOrders(res.pagination.total);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    const alertDialog = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    if (!alertDialog) return;
    
    try {
      await cancelOrder(id);
      toast.success("Order cancelled successfully.");
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus: "Cancelled" } : o));
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
      </div>
    );
  }
  if (error) {
    return <div className="max-w-4xl mx-auto py-10 px-4 text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
            <Button onClick={() => router.push('/products')}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders ({totalOrders})</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Order placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium mb-2">
                    Order ID: {order._id}
                  </p>
                  <Badge variant={getStatusColor(order.orderStatus)}>
                    {order.orderStatus ? (
                      order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="font-bold">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="grid gap-2">
                  {order.items.map((item) => (
                    <div key={item.product} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 