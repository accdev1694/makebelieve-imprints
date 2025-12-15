export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string | { id: string; name: string; slug: string };
  imageUrl?: string;
  images: string[];
  customizable: boolean;
  stock: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customization?: ProductCustomization;
}

export interface ProductCustomization {
  designUrl?: string;
  text?: string;
  color?: string;
  size?: string;
  [key: string]: any;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: ProductCustomization;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  firstName?: string;
  lastName?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface CheckoutData {
  shippingAddress?: Address;
  billingAddress?: Address;
  useSameAddress?: boolean;
  shippingMethod?: ShippingMethod;
  paymentMethod?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
