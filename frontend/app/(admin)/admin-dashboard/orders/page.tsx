"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAllOrders, updateOrderStatus } from "@/lib/api";
import { Order } from "@/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type OrderStatus = typeof ORDER_STATUSES[number];
type StatusFilter = OrderStatus | "all";

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
    if (status === "authenticated" && session.user.role === "admin") {
      setLoading(true);
      getAllOrders({
        page: currentPage,
        limit: pageSize,
        status: selectedStatus === "all" ? undefined : selectedStatus
      })
        .then((res) => {
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!window.confirm(`Are you sure you want to change the order status to ${newStatus}?`)) {
      return;
    }
    try {
      await updateOrderStatus(id, newStatus as OrderStatus);
      toast.success("Order status updated.");
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus: newStatus as OrderStatus } : o));
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
      </div>
    );
  }
  if (error) {
    return <div className="max-w-6xl mx-auto py-10 px-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Orders ({totalOrders})</h1>
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
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No orders found.</TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono">{order._id}</TableCell>
                <TableCell>{order.user?.name || order.user?.email}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select value={order.orderStatus} onValueChange={(val) => handleStatusChange(order._id, val as OrderStatus)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => router.push(`/admin-dashboard/orders/${order._id}`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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