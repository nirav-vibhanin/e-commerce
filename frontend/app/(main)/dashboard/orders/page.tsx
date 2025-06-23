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

const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

export default function UserOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
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
        status: selectedStatus || undefined
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
              <SelectItem value="">All Statuses</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No orders found.</TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono">{order._id}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    order.orderStatus === "Pending" && "bg-yellow-100 text-yellow-800",
                    order.orderStatus === "Processing" && "bg-blue-100 text-blue-800",
                    order.orderStatus === "Confirmed" && "bg-purple-100 text-purple-800",
                    order.orderStatus === "Shipped" && "bg-indigo-100 text-indigo-800",
                    order.orderStatus === "Delivered" && "bg-green-100 text-green-800",
                    order.orderStatus === "Cancelled" && "bg-red-100 text-red-800"
                  )}>
                    {order.orderStatus}
                  </span>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => router.push(`/dashboard/orders/${order._id}`)}>
                    View
                  </Button>
                  {order.orderStatus === "Pending" && (
                    <Button variant="destructive" className="ml-2" onClick={() => handleCancel(order._id)}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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