import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customization?: any;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  // Signal-based state
  items = signal<CartItem[]>([]);
  totalItems = computed(() => this.items().reduce((count, item) => count + item.quantity, 0));
  subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.price * item.quantity, 0)
  );

  private cartKey = 'shopping_cart';
  private readonly TAX_RATE = 0.08; // 8% tax
  private readonly FREE_SHIPPING_THRESHOLD = 50;
  private readonly SHIPPING_COST = 5.99;

  constructor() {
    this.loadCart();
  }

  addItem(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.updateCart(currentItems);
    } else {
      this.updateCart([...currentItems, item]);
    }
  }

  // Alias for backward compatibility
  addToCart(item: CartItem): void {
    this.addItem(item);
  }

  removeItem(productId: string): void {
    const currentItems = this.cartItems.value.filter((item) => item.productId !== productId);
    this.updateCart(currentItems);
  }

  // Alias for backward compatibility
  removeFromCart(productId: string): void {
    this.removeItem(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.cartItems.value;
    const item = currentItems.find((i) => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      this.updateCart(currentItems);
    }
  }

  incrementQuantity(productId: string): void {
    const item = this.cartItems.value.find((i) => i.productId === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: string): void {
    const item = this.cartItems.value.find((i) => i.productId === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getSubtotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTax(): number {
    return this.getSubtotal() * this.TAX_RATE;
  }

  getShipping(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShipping();
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  getSummary(): CartSummary {
    return {
      subtotal: this.getSubtotal(),
      tax: this.getTax(),
      shipping: this.getShipping(),
      total: this.getTotal(),
      itemCount: this.getItemCount(),
    };
  }

  hasItems(): boolean {
    return this.cartItems.value.length > 0;
  }

  getItem(productId: string): CartItem | undefined {
    return this.cartItems.value.find((item) => item.productId === productId);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items);
    this.items.set(items);
    this.saveCart(items);
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  private loadCart(): void {
    const stored = localStorage.getItem(this.cartKey);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        this.cartItems.next(items);
        this.items.set(items);
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }
}
