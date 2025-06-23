"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAllOrders, updateOrderStatus } from "@/lib/api";
import { Order } from "@/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type OrderStatus = Order['orderStatus'];
type StatusFilter = OrderStatus | 'all';

interface OrdersResponse {
  data: Order[];
  pagination: {
    total: number;
    pages: number;
  };
}

const getStatusColor = (status: OrderStatus | undefined) => {
  if (!status) return 'default';
  switch (status) {
    case 'Cancelled':
      return 'destructive';
    case 'Delivered':
      return 'default';
    case 'Processing':
      return 'default';
    case 'Shipped':
      return 'default';
    default:
      return 'default';
  }
};

const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function isUserObject(user: unknown): user is { _id?: string; name?: string; email?: string } {
  return typeof user === 'object' && user !== null && (
    'name' in user || 'email' in user || '_id' in user
  );
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 10;
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      setLoading(true);
      getAllOrders({
        page: currentPage,
        limit: pageSize,
        status: selectedStatus === "all" ? undefined : selectedStatus
      })
        .then((res: OrdersResponse) => {
          setOrders(res.data);
          setPageCount(res.pagination.pages);
          setTotalOrders(res.pagination.total);
          setError(null);
        })
        .catch(() => setError("Failed to load orders."))
        .finally(() => setLoading(false));
    }
  }, [status, session, currentPage, pageSize, selectedStatus]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user.role !== "admin") {
      router.push("/dashboard");
    } else {
      fetchOrders();
    }
  }, [status, session, router, fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!window.confirm(`Are you sure you want to change the order status to ${newStatus}?`)) {
      return;
    }
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully");
      setOrders((prev) => prev.map((o) => 
        o._id === orderId ? { ...o, orderStatus: newStatus } : o
      ));
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Orders ({totalOrders})</h1>
        <div className="flex items-center gap-4">
          <Select 
            value={selectedStatus} 
            onValueChange={(value: StatusFilter) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono">{order._id}</TableCell>
                  <TableCell>
                    {isUserObject(order.user)
                      ? (order.user.name || order.user.email || order.user._id || '-')
                      : (order.user || '-')}
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select 
                      value={order.orderStatus} 
                      onValueChange={(value) => handleStatusChange(order._id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge variant={getStatusColor(order.orderStatus)}>
                            {order.orderStatus ? (
                              order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                            ) : (
                              'Pending'
                            )}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>${(order.totalAmount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin-dashboard/orders/${order._id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4 text-sm">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 