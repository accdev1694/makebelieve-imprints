import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  incrementQuantity(productId: string): void {
    this.cartService.incrementQuantity(productId);
  }

  decrementQuantity(productId: string): void {
    this.cartService.decrementQuantity(productId);
  }

  removeItem(productId: string): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeItem(productId);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
    }
  }

  get summary() {
    return this.cartService.getSummary();
  }

  get hasItems(): boolean {
    return this.cartService.hasItems();
  }
}
