import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  productId: string;
  quantity: number;
  customizationData?: any;
  designFileUrl?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: any;
  billingAddress: any;
  shippingMethod?: string;
  shippingCost: number;
  tax: number;
  discount?: number;
  customerNotes?: string;
  currency?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: string;
  paymentMethod?: string;
  shippingAddress: any;
  billingAddress: any;
  shippingMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  customerNotes?: string;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponse {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  productSnapshot: any;
  customizationData?: any;
  designFileUrl?: string;
  product?: any;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

export interface OrderStatsResponse {
  success: boolean;
  stats: {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  /**
   * Create a new order
   */
  createOrder(orderData: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData);
  }

  /**
   * Get current user's orders
   */
  getUserOrders(page: number = 1, limit: number = 10, status?: string): Observable<OrdersResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<OrdersResponse>(this.apiUrl, { params });
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string, cancellationReason?: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/${orderId}/cancel`, {
      cancellationReason,
    });
  }

  /**
   * Update order status (Admin only)
   */
  updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string,
    trackingUrl?: string,
    adminNotes?: string
  ): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${orderId}/status`, {
      status,
      trackingNumber,
      trackingUrl,
      adminNotes,
    });
  }

  /**
   * Get all orders (Admin only)
   */
  getAllOrders(
    page: number = 1,
    limit: number = 20,
    status?: string,
    search?: string
  ): Observable<OrdersResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<OrdersResponse>(`${this.apiUrl}/admin/all`, {
      params,
    });
  }

  /**
   * Get order statistics (Admin only)
   */
  getOrderStats(): Observable<OrderStatsResponse> {
    return this.http.get<OrderStatsResponse>(`${this.apiUrl}/admin/stats`);
  }

  /**
   * Calculate tax for checkout
   */
  calculateTax(subtotal: number, shippingAddress: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/checkout/calculate-tax`, {
      subtotal,
      shippingAddress,
    });
  }

  /**
   * Get tax rate for address
   */
  getTaxRate(shippingAddress: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/checkout/tax-rate`, {
      shippingAddress,
    });
  }

  /**
   * Validate shipping address
   */
  validateAddress(address: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/checkout/validate-address`, {
      address,
    });
  }

  /**
   * Save draft order (incomplete checkout)
   */
  saveDraft(
    step: number,
    formData: any,
    cartItems?: any[],
    selectedShipping?: any
  ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/checkout/draft`, {
      step,
      formData,
      cartItems,
      selectedShipping,
    });
  }

  /**
   * Get saved draft order
   */
  getDraft(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/checkout/draft`);
  }

  /**
   * Delete draft order
   */
  deleteDraft(): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/checkout/draft`);
  }
}
