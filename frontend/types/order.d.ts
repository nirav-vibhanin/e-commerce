import { Product } from './product';

export interface OrderItem {
  product: string;  // Product ID
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  _id: string;
  user: string;  // User ID
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Cash on Delivery';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
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