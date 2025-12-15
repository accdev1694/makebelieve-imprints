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

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  // Signal-based state
  items = signal<CartItem[]>([]);
  totalItems = computed(() => this.items().reduce((count, item) => count + item.quantity, 0));

  private cartKey = 'shopping_cart';

  constructor() {
    this.loadCart();
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.updateCart(currentItems);
    } else {
      this.updateCart([...currentItems, item]);
    }
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value.filter((item) => item.productId !== productId);
    this.updateCart(currentItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find((i) => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      this.updateCart(currentItems);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
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
