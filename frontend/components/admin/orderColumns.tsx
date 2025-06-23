"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";

type OrderStatus = Order['orderStatus'];

const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusColor = (status: OrderStatus) => {
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

function isUserObject(user: unknown): user is { _id?: string; name?: string; email?: string } {
  return typeof user === 'object' && user !== null && (
    'name' in user || 'email' in user || '_id' in user
  );
}

function getUserDisplay(user: unknown) {
  return isUserObject(user)
    ? (user.name || user.email || user._id || '-')
    : (user || '-');
}

function getProductDisplay(product: unknown) {
  return typeof product === 'object' && product !== null && 'name' in product
    ? product.name
    : typeof product === 'string'
      ? product
      : '-';
}

export const orderColumns = (
  onStatusChange: (id: string, status: OrderStatus) => void,
  onViewOrder: (orderId: string) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("_id")}</span>
    ),
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => getUserDisplay(row.getValue("user")),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Select 
          value={order.orderStatus} 
          onValueChange={val => onStatusChange(order._id, val as OrderStatus)}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              <Badge variant={getStatusColor(order.orderStatus)}>
                {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Pending'}
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
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const value = row.getValue("totalAmount");
      const num = typeof value === "number" ? value : Number(value) || 0;
      return `$${num.toFixed(2)}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewOrder(order._id)}
          >
            View Details
          </Button>
        </div>
      );
    },
  },
]; 