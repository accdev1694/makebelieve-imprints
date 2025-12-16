import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService, CreateOrderRequest } from '../../core/services/order.service';
import { CheckoutData, Address, ShippingMethod } from '../../models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Empty Cart Message -->
        @if (cartItems.length === 0) {
        <div class="max-w-2xl mx-auto text-center py-12">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <svg
              class="w-24 h-24 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Add some products to your cart before checking out.
            </p>
            <a
              href="/products"
              class="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Products
            </a>
          </div>
        </div>
        } @else {

        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex items-center justify-center">
            <div *ngFor="let step of steps; let i = index" class="flex items-center">
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors"
                  [class.bg-cyan-500]="currentStep() >= i + 1"
                  [class.text-white]="currentStep() >= i + 1"
                  [class.bg-gray-300]="currentStep() < i + 1"
                  [class.text-gray-600]="currentStep() < i + 1"
                >
                  {{ i + 1 }}
                </div>
                <span class="text-xs mt-2 text-gray-600 dark:text-gray-400">{{ step }}</span>
              </div>
              <div
                *ngIf="i < steps.length - 1"
                class="w-24 h-1 mx-4 transition-colors"
                [class.bg-cyan-500]="currentStep() > i + 1"
                [class.bg-gray-300]="currentStep() <= i + 1"
              ></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <!-- Step 1: Shipping Address -->
              <div *ngIf="currentStep() === 1">
                <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Shipping Address
                </h2>
                <form [formGroup]="shippingForm" (ngSubmit)="onShippingSubmit()">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        formControlName="firstName"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        formControlName="lastName"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      formControlName="street"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      formControlName="street2"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        formControlName="city"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        State *
                      </label>
                      <input
                        type="text"
                        formControlName="state"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        formControlName="zipCode"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country *
                    </label>
                    <select
                      formControlName="country"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      formControlName="phone"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    [disabled]="shippingForm.invalid"
                    class="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue to Shipping Method
                  </button>
                </form>
              </div>

              <!-- Step 2: Shipping Method -->
              <div *ngIf="currentStep() === 2">
                <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Shipping Method
                </h2>
                <div class="space-y-4">
                  <div
                    *ngFor="let method of shippingMethods"
                    (click)="selectShippingMethod(method)"
                    class="border-2 rounded-lg p-4 cursor-pointer transition-colors hover:border-cyan-500"
                    [class.border-cyan-500]="checkoutData.shippingMethod?.id === method.id"
                    [class.border-gray-300]="checkoutData.shippingMethod?.id !== method.id"
                    [class.dark:border-gray-600]="checkoutData.shippingMethod?.id !== method.id"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                          {{ method.name }}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          {{ method.description }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          Estimated delivery: {{ method.estimatedDays }}
                        </p>
                      </div>
                      <div class="text-lg font-bold text-gray-900 dark:text-white">
                        \${{ method.price.toFixed(2) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-4 mt-6">
                  <button
                    (click)="previousStep()"
                    class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    (click)="nextStep()"
                    [disabled]="!checkoutData.shippingMethod"
                    class="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>

              <!-- Step 3: Payment -->
              <div *ngIf="currentStep() === 3">
                <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Payment</h2>
                <form [formGroup]="paymentForm" (ngSubmit)="onPaymentSubmit()">
                  <div class="mb-6">
                    <label
                      class="flex items-center space-x-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        formControlName="useSameAddress"
                        class="w-5 h-5 text-cyan-500"
                      />
                      <span class="text-gray-900 dark:text-white">
                        Billing address same as shipping
                      </span>
                    </label>
                  </div>

                  <div *ngIf="!paymentForm.get('useSameAddress')?.value" class="mb-6">
                    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Billing Address
                    </h3>
                    <!-- Billing address form fields (similar to shipping) -->
                    <p class="text-gray-600 dark:text-gray-400">
                      Billing address form will be added here...
                    </p>
                  </div>

                  <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Payment Method
                    </h3>
                    <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6">
                      <p class="text-gray-600 dark:text-gray-400 mb-4">
                        Stripe payment integration will be added here
                      </p>
                      <div class="space-y-4">
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Card Number *
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              CVV *
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-4">
                    <button
                      type="button"
                      (click)="previousStep()"
                      class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      class="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Order Summary</h3>

              <div class="space-y-4 mb-4">
                <div *ngFor="let item of cartItems" class="flex gap-3">
                  <img
                    [src]="item.imageUrl"
                    [alt]="item.name"
                    class="w-16 h-16 object-cover rounded"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                  </div>
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    \${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span class="text-gray-900 dark:text-white">\${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span class="text-gray-900 dark:text-white">
                    {{
                      checkoutData.shippingMethod
                        ? '$' + checkoutData.shippingMethod.price.toFixed(2)
                        : 'TBD'
                    }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Tax</span>
                  <span class="text-gray-900 dark:text-white">\${{ tax.toFixed(2) }}</span>
                </div>
                <div
                  class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-lg font-bold"
                >
                  <span class="text-gray-900 dark:text-white">Total</span>
                  <span class="text-gray-900 dark:text-white">\${{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        }
      </div>
    </div>
  `,
  styles: [],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  currentStep = signal(1);
  steps = ['Shipping', 'Shipping Method', 'Payment'];

  shippingForm: FormGroup;
  paymentForm: FormGroup;

  checkoutData: CheckoutData = {};

  // Use the signal directly for reactive updates
  get cartItems() {
    return this.cartService.items();
  }

  shippingMethods: ShippingMethod[] = [
    {
      id: '1',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      price: 5.99,
      estimatedDays: '5-7 business days',
    },
    {
      id: '2',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      price: 12.99,
      estimatedDays: '2-3 business days',
    },
    {
      id: '3',
      name: 'Next Day Delivery',
      description: 'Delivery by next business day',
      price: 24.99,
      estimatedDays: 'Next business day',
    },
  ];

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get tax(): number {
    // Tax will be calculated dynamically based on shipping address
    // For now, use stored tax amount or calculate as fallback
    if (this.checkoutData.shippingAddress) {
      // Will be updated when shipping address is set
      return this.calculatedTax;
    }
    return 0;
  }

  get total(): number {
    const shipping = this.checkoutData.shippingMethod?.price || 0;
    return this.subtotal + this.tax + shipping;
  }

  private calculatedTax = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['US', Validators.required],
      phone: ['', Validators.required],
    });

    this.paymentForm = this.fb.group({
      useSameAddress: [true],
    });

    // Load draft order if exists
    this.loadDraft();

    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.saveDraft();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  private autoSaveInterval: any;

  private saveDraft(): void {
    if (!this.cartItems.length) return;

    const formData = {
      shipping: this.shippingForm.value,
      payment: this.paymentForm.value,
    };

    this.orderService
      .saveDraft(this.currentStep(), formData, this.cartItems, this.checkoutData.shippingMethod)
      .subscribe({
        next: () => {
          console.log('Draft saved');
        },
        error: (err) => {
          console.error('Failed to save draft:', err);
        },
      });
  }

  private loadDraft(): void {
    this.orderService.getDraft().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const draft = response.data;

          // Restore form data
          if (draft.formData?.shipping) {
            this.shippingForm.patchValue(draft.formData.shipping);
          }
          if (draft.formData?.payment) {
            this.paymentForm.patchValue(draft.formData.payment);
          }

          // Restore step
          if (draft.step) {
            this.currentStep.set(draft.step);
          }

          // Restore selected shipping
          if (draft.selectedShipping) {
            this.checkoutData.shippingMethod = draft.selectedShipping;
          }

          console.log('Draft loaded successfully');
        }
      },
      error: (err) => {
        console.error('Failed to load draft:', err);
      },
    });
  }

  onShippingSubmit(): void {
    if (this.shippingForm.valid) {
      // First validate the address
      const addressData = {
        firstName: this.shippingForm.value.firstName,
        lastName: this.shippingForm.value.lastName,
        address1: this.shippingForm.value.street,
        address2: this.shippingForm.value.street2,
        city: this.shippingForm.value.city,
        state: this.shippingForm.value.state,
        postalCode: this.shippingForm.value.zipCode,
        country: this.shippingForm.value.country,
        phone: this.shippingForm.value.phone,
      };

      this.orderService.validateAddress(addressData).subscribe({
        next: (response) => {
          if (response.success && response.data.valid) {
            // Address is valid, use normalized version
            this.checkoutData.shippingAddress = this.shippingForm.value;

            // Show warnings if any
            if (response.data.warnings && response.data.warnings.length > 0) {
              console.warn('Address warnings:', response.data.warnings);
            }

            // Calculate tax based on shipping address
            const address = {
              country: this.shippingForm.value.country,
              state: this.shippingForm.value.state,
              postalCode: this.shippingForm.value.zipCode,
            };

            this.orderService.calculateTax(this.subtotal, address).subscribe({
              next: (response) => {
                if (response.success && response.data) {
                  this.calculatedTax = response.data.taxAmount;
                  console.log('Tax calculated:', response.data);
                }
              },
              error: (error) => {
                console.error('Failed to calculate tax:', error);
                // Fallback to 0 tax on error
                this.calculatedTax = 0;
              },
            });

            this.nextStep();
          } else {
            // Address validation failed
            const errors = response.data?.errors || ['Address validation failed'];
            alert('Address validation errors:\n' + errors.join('\n'));
          }
        },
        error: (error) => {
          console.error('Failed to validate address:', error);
          // Continue anyway if validation service fails
          this.checkoutData.shippingAddress = this.shippingForm.value;

          // Calculate tax
          const address = {
            country: this.shippingForm.value.country,
            state: this.shippingForm.value.state,
            postalCode: this.shippingForm.value.zipCode,
          };

          this.orderService.calculateTax(this.subtotal, address).subscribe({
            next: (response) => {
              if (response.success && response.data) {
                this.calculatedTax = response.data.taxAmount;
              }
            },
            error: () => {
              this.calculatedTax = 0;
            },
          });

          this.nextStep();
        },
      });
    }
  }

  selectShippingMethod(method: ShippingMethod): void {
    this.checkoutData.shippingMethod = method;
  }

  onPaymentSubmit(): void {
    if (!this.checkoutData.shippingAddress || !this.checkoutData.shippingMethod) {
      console.error('Missing required checkout data');
      return;
    }

    // Prepare order data
    const orderData: CreateOrderRequest = {
      items: this.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        customizationData: item.customization,
        designFileUrl: undefined,
      })),
      shippingAddress: this.checkoutData.shippingAddress,
      billingAddress: this.paymentForm.value.useSameAddress
        ? this.checkoutData.shippingAddress
        : this.checkoutData.billingAddress || this.checkoutData.shippingAddress,
      shippingMethod: this.checkoutData.shippingMethod.name,
      shippingCost: this.checkoutData.shippingMethod.price,
      tax: this.tax,
      discount: 0,
      currency: 'GBP',
    };

    // Create order
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response.order);

        // Delete draft order since checkout is complete
        this.orderService.deleteDraft().subscribe({
          next: () => console.log('Draft deleted'),
          error: (err) => console.error('Failed to delete draft:', err),
        });

        // Clear cart
        this.cartService.clearCart();

        // Navigate to confirmation with order data
        this.router.navigate(['/checkout/confirmation'], {
          queryParams: { orderNumber: response.order.orderNumber },
          state: { order: response.order },
        });
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        alert('Failed to create order. Please try again.');
      },
    });
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }
}
