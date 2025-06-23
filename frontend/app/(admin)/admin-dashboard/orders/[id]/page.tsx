"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/lib/api";
import { Order } from "@/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session.user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    getOrderById(id)
      .then((data) => {
        setOrder(data);
        setTrackingNumber((data as any).trackingNumber || "");
        setNotes((data as any).notes || "");
      })
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [id, status, session, router]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    const confirmMessage = newStatus === "Cancelled" 
      ? "Are you sure you want to cancel this order? This action cannot be undone."
      : `Are you sure you want to change the order status to ${newStatus}?`;
    
    if (!window.confirm(confirmMessage)) return;

    setUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus, { trackingNumber, notes });
      toast.success("Order status updated successfully.");
      setOrder((prev) => prev ? { 
        ...prev, 
        orderStatus: newStatus,
        trackingNumber: trackingNumber,
        notes: notes
      } : null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  function isUserObject(user: unknown): user is { _id?: string; name?: string; email?: string } {
    return typeof user === 'object' && user !== null && (
      'name' in user || 'email' in user || '_id' in user
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
      </div>
    );
  }
  if (error || !order) {
    return <div className="max-w-3xl mx-auto py-10 px-4 text-red-500">{error || "Order not found."}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Button variant="outline" onClick={() => router.push("/admin-dashboard/orders")}>
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="mb-4">
            <span className="font-semibold">Order ID:</span>{" "}
            <span className="font-mono">{order._id}</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Order Date:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Customer:</span>{' '}
            {isUserObject(order.user)
              ? (order.user.name || order.user.email || order.user._id || '-')
              : (order.user || '-')}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Total:</span>{" "}
            ${order.total.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <span className="font-semibold">Status:</span>
            <Select 
              value={order.orderStatus} 
              onValueChange={(val) => handleStatusChange(val as OrderStatus)} 
              disabled={updating}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about the order"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <div>
          {order.shippingAddress?.street}<br />
          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
          {order.shippingAddress?.country}<br />
          Phone: {order.shippingAddress?.phone}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
        <div>
          <div><span className="font-medium">Method:</span> {order.paymentMethod}</div>
          <div><span className="font-medium">Status:</span> {order.paymentStatus || "Pending"}</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Order Items</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {typeof item.product === "object" && item.product !== null && "name" in item.product
                  ? (item.product as { name?: string }).name || "-"
                  : typeof item.product === "string"
                    ? item.product
                    : "-"}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${(item.price || 0).toFixed(2)}</TableCell>
              <TableCell>${((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 text-right">
        <div className="space-y-2">
          <div>
            <span className="font-medium">Subtotal:</span>{" "}
            {order.subtotal !== undefined
              ? `$${order.subtotal.toFixed(2)}`
              : `$${((order.total || 0) - (order.tax || 0) - (order.shippingCost || 0)).toFixed(2)}`}
          </div>
          <div>
            <span className="font-medium">Shipping:</span>{" "}
            {order.shippingCost !== undefined
              ? `$${order.shippingCost.toFixed(2)}`
              : "0.00"}
          </div>
          <div>
            <span className="font-medium">Tax:</span>{" "}
            {order.tax !== undefined
              ? `$${order.tax.toFixed(2)}`
              : "0.00"}
          </div>
          <div className="text-lg font-bold">
            <span>Total:</span>{" "}
            ${order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
} 