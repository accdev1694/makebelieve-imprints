import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService, type Order } from '../../core/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (loading()) {
        <div class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"
          ></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
        } @else if (error()) {
        <div
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
        >
          <h2 class="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Order Not Found</h2>
          <p class="text-red-600 dark:text-red-400">{{ error() }}</p>
          <button
            (click)="goHome()"
            class="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
        } @else if (order()) {
        <!-- Success Message -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        <!-- Order Details Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Details</h2>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Order Number:</span>
              <span class="font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                {{ order()!.orderNumber }}
              </span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-gray-600 dark:text-gray-400">Order Date:</span>
              <span class="text-gray-900 dark:text-white">
                {{ order()!.createdAt | date : 'medium' }}
              </span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-gray-600 dark:text-gray-400">Status:</span>
              <span
                class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium"
              >
                {{ order()!.status | titlecase }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Items</h3>
            <div class="space-y-3">
              @for (item of order()!.items; track item.id) {
              <div class="flex items-center gap-4">
                @if (item.productSnapshot.images && item.productSnapshot.images.length > 0) {
                <img
                  [src]="item.productSnapshot.images[0]"
                  [alt]="item.productSnapshot.name"
                  class="w-16 h-16 object-cover rounded"
                />
                }
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ item.productSnapshot.name }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: {{ item.quantity }} × £{{ item.price }}
                  </p>
                </div>
                <p class="font-semibold text-gray-900 dark:text-white">£{{ item.subtotal }}</p>
              </div>
              }
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="space-y-2">
              <div class="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>£{{ order()!.subtotal }}</span>
              </div>
              <div class="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping:</span>
                <span>£{{ order()!.shippingCost }}</span>
              </div>
              <div class="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax:</span>
                <span>£{{ order()!.tax }}</span>
              </div>
              @if (order()!.discount > 0) {
              <div class="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount:</span>
                <span>-£{{ order()!.discount }}</span>
              </div>
              }
              <div
                class="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2"
              >
                <span>Total:</span>
                <span>£{{ order()!.total }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h3>
          <div class="text-gray-600 dark:text-gray-400">
            <p>{{ order()!.shippingAddress.firstName }} {{ order()!.shippingAddress.lastName }}</p>
            <p>{{ order()!.shippingAddress.street }}</p>
            @if (order()!.shippingAddress.street2) {
            <p>{{ order()!.shippingAddress.street2 }}</p>
            }
            <p>
              {{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.state }}
              {{ order()!.shippingAddress.zipCode }}
            </p>
            <p>{{ order()!.shippingAddress.country }}</p>
            @if (order()!.shippingAddress.phone) {
            <p class="mt-2">Phone: {{ order()!.shippingAddress.phone }}</p>
            }
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            (click)="viewOrder()"
            class="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
          >
            View Order Details
          </button>
          <button
            (click)="goHome()"
            class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
        }
      </div>
    </div>
  `,
})
export class OrderConfirmationComponent implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  orderNumber = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Try to get order from navigation state first
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state?.['order']) {
      this.order.set(state['order']);
      this.orderNumber.set(state['order'].orderNumber);
      this.loading.set(false);
      return;
    }

    // Otherwise, get order number from query params and fetch
    this.route.queryParams.subscribe((params) => {
      const orderNumber = params['orderNumber'];
      if (orderNumber) {
        this.orderNumber.set(orderNumber);
        this.loadOrderByNumber(orderNumber);
      } else {
        this.error.set('No order number provided');
        this.loading.set(false);
      }
    });
  }

  private loadOrderByNumber(orderNumber: string): void {
    // For now, we'll need to fetch user orders and find by order number
    // In production, you might want a dedicated endpoint: GET /api/orders/by-number/:orderNumber
    this.orderService.getUserOrders(1, 50).subscribe({
      next: (response: any) => {
        const foundOrder = response.orders.find((o: Order) => o.orderNumber === orderNumber);
        if (foundOrder) {
          this.order.set(foundOrder);
        } else {
          this.error.set('Order not found');
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load order:', err);
        this.error.set('Failed to load order details');
        this.loading.set(false);
      },
    });
  }

  viewOrder(): void {
    if (this.order()) {
      this.router.navigate(['/account/orders', this.order()!.id]);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
