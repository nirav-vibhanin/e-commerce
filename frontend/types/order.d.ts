import { Product } from './product';

export type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
};

export type Order = {
  _id: string;
  user: { _id: string; name: string; email: string };
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
};

export type OrderListResponse = {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}; 