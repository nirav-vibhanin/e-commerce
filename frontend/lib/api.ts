import axios from 'axios';
import { getSession } from 'next-auth/react';
import { GetUsersResponse, User } from "@/types/user";
import { Product, ProductListResponse, ProductCategoryResponse } from "@/types/product";
import { Order, OrderListResponse } from "@/types/order";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${session.user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      // We re-throw the error with a more specific message from the API if available
      return Promise.reject(new Error(error.response.data.message || 'An error occurred'));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Network error, please try again.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);

export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<GetUsersResponse> => {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("Not authenticated");
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.append("search", search);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const getUser = async (userId: string): Promise<User> => {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  
  const data = await response.json();
  return data.data;
};

export const getUserOrders = async (userId: string): Promise<any[]> => {
    const session = await getSession();
    if (!session?.user?.token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/orders`,
        {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user orders");
    }
    const data = await response.json();
    return data.data;
};

export const getUserStats = async (userId: string): Promise<any> => {
    const session = await getSession();
    if (!session?.user?.token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/stats`,
        {
            headers: {
                Authorization: `Bearer ${session.user.token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user stats");
    }
    const data = await response.json();
    return data.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create user");
  }

  return response.json();
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }

  return response.json();
};

export const deleteUser = async (userId: string): Promise<void> => {
  const session = await getSession();
  if (!session?.user?.token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete user");
  }
};

// --- Product API ---

export const getProducts = async (params: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
} = {}): Promise<ProductListResponse> => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

export const getProductCategories = async (): Promise<ProductCategoryResponse> => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const response = await api.post('/products', productData);
  return response.data.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// --- Order API ---

// User: get their own orders
export const getOrders = async (params: { 
  page?: number; 
  limit?: number;
  status?: string;
} = {}): Promise<OrderListResponse> => {
  const response = await api.get('/orders', { params });
  return response.data;
};

// Admin: get all orders
export const getAllOrders = async (params: { 
  page?: number; 
  limit?: number;
  status?: string;
} = {}): Promise<OrderListResponse> => {
  const response = await api.get('/orders/admin/all', { params });
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  const response = await api.post('/orders', orderData);
  return response.data.data;
};

export const updateOrderStatus = async (
  id: string, 
  status: string,
  data?: {
    trackingNumber?: string;
    notes?: string;
  }
): Promise<Order> => {
  const response = await api.put(`/orders/${id}/status`, { 
    status,
    ...data
  });
  return response.data.data;
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data.data;
};

// Cart APIs
export const getCart = async () => {
  const session = await getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(session?.user?.token ? { Authorization: `Bearer ${session.user.token}` } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch cart");
  }
  return response.json();
};

export const addToCart = async (productId: string, quantity: number) => {
  const session = await getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(session?.user?.token ? { Authorization: `Bearer ${session.user.token}` } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add item to cart");
  }
  return response.json();
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const session = await getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(session?.user?.token ? { Authorization: `Bearer ${session.user.token}` } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${productId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update cart item");
  }
  return response.json();
};

export const removeFromCart = async (productId: string) => {
  const session = await getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(session?.user?.token ? { Authorization: `Bearer ${session.user.token}` } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${productId}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove item from cart");
  }
  return response.json();
};

export const clearCart = async () => {
  const session = await getSession();
  const headers = {
    "Content-Type": "application/json",
    ...(session?.user?.token ? { Authorization: `Bearer ${session.user.token}` } : {}),
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to clear cart");
  }
  return response.json();
};

export default api; 