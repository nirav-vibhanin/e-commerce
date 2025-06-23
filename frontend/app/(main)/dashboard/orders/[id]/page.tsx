"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getOrderById, cancelOrder } from "@/lib/api";
import { Order } from "@/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function UserOrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    getOrderById(id)
      .then((data) => setOrder(data))
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [id, status, router]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      await cancelOrder(order._id);
      toast.success("Order cancelled successfully.");
      setOrder((prev) => prev ? { ...prev, orderStatus: "Cancelled" } : null);
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order.");
    }
  };

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
        <div className="flex gap-2">
          {order.orderStatus === "Pending" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Order</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, keep order</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>Yes, cancel order</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>
            Back to Orders
          </Button>
        </div>
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
            <span className="font-semibold">Status:</span>{" "}
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
          </div>
          {order.estimatedDelivery && (
            <div className="mb-4">
              <span className="font-semibold">Estimated Delivery:</span>{" "}
              {new Date(order.estimatedDelivery).toLocaleDateString()}
            </div>
          )}
          {order.trackingNumber && (
            <div className="mb-4">
              <span className="font-semibold">Tracking Number:</span>{" "}
              {order.trackingNumber}
            </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <span className="font-semibold">Payment Method:</span>{" "}
            {order.paymentMethod}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Payment Status:</span>{" "}
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              order.paymentStatus === "Pending" && "bg-yellow-100 text-yellow-800",
              order.paymentStatus === "Paid" && "bg-green-100 text-green-800",
              order.paymentStatus === "Failed" && "bg-red-100 text-red-800",
              order.paymentStatus === "Refunded" && "bg-gray-100 text-gray-800"
            )}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <div>
          {order.shippingAddress.street}<br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
          {order.shippingAddress.country}<br />
          Phone: {order.shippingAddress.phone}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Order Items</h2>
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
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 text-right">
        <div className="space-y-2">
          <div>
            <span className="font-medium">Subtotal:</span>{" "}
            ${order.subtotal.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Shipping:</span>{" "}
            ${order.shippingCost.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Tax:</span>{" "}
            ${order.tax.toFixed(2)}
          </div>
          {order.discount?.toFixed(2) && (
            <div>
              <span className="font-medium">Discount:</span>{" "}
              -${order.discount.toFixed(2)}
            </div>
          )}
          <div className="text-lg font-bold">
            <span>Total:</span>{" "}
            ${order.total.toFixed(2)}
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Order Notes</h2>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  );
} 