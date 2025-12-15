import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="product-card group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <!-- Product Image -->
      <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <a [routerLink]="['/products', product.id]" class="block h-full">
          <img
            [src]="getProductImage()"
            [alt]="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </a>

        <!-- Badges -->
        <div class="absolute top-2 left-2 flex flex-col gap-2">
          <span
            *ngIf="product.customizable"
            class="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded"
          >
            Customizable
          </span>
          <span
            *ngIf="isNew"
            class="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded"
          >
            New
          </span>
          <span
            *ngIf="product.stock === 0"
            class="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded"
          >
            Out of Stock
          </span>
        </div>

        <!-- Quick Actions -->
        <div
          class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            type="button"
            class="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Add to wishlist"
          >
            <svg
              class="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <!-- Category -->
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {{ getCategoryName(product.category) }}
        </p>

        <!-- Product Name -->
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          <a
            [routerLink]="['/products', product.id]"
            class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {{ product.name }}
          </a>
        </h3>

        <!-- Description -->
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {{ product.description }}
        </p>

        <!-- Price and Action -->
        <div class="flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ product.price | currency }}
            </span>
          </div>

          <button
            type="button"
            (click)="onAddToCart()"
            [disabled]="product.stock === 0"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span class="hidden sm:inline">{{ product.stock === 0 ? 'Out of Stock' : 'Add' }}</span>
          </button>
        </div>

        <!-- Tags -->
        <div *ngIf="product.tags && product.tags.length > 0" class="mt-3 flex flex-wrap gap-1">
          <span
            *ngFor="let tag of product.tags.slice(0, 3)"
            class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  get isNew(): boolean {
    if (!this.product.createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(this.product.createdAt) > thirtyDaysAgo;
  }

  onAddToCart(): void {
    if (this.product.stock > 0) {
      this.addToCart.emit(this.product);
    }
  }

  getProductImage(): string {
    // Handle if images is an array
    if (
      this.product.images &&
      Array.isArray(this.product.images) &&
      this.product.images.length > 0
    ) {
      return this.product.images[0];
    }
    // Fallback to imageUrl if it exists
    if (this.product.imageUrl) {
      return this.product.imageUrl;
    }
    // Default placeholder
    return '/assets/placeholder-product.png';
  }

  getCategoryName(category: any): string {
    // Handle if category is an object with name property
    if (category && typeof category === 'object' && category.name) {
      return category.name;
    }
    // Handle if category is a string
    if (typeof category === 'string') {
      return category;
    }
    return 'Uncategorized';
  }
}
