import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import {
  ProductService,
  ProductFilters,
  ProductSortOptions,
  PaginationOptions,
} from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoadingSpinnerComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: any[] = [];
  loading = false;
  error: string | null = null;

  // View mode
  viewMode: 'grid' | 'list' = 'grid';

  // Filters
  filters: ProductFilters = {};
  searchQuery = '';
  private searchSubject = new Subject<string>();

  // Sorting
  sortOptions: ProductSortOptions = { sortBy: 'createdAt', sortOrder: 'desc' };
  sortDisplay = [
    { label: 'Newest First', value: { sortBy: 'createdAt', sortOrder: 'desc' } },
    { label: 'Price: Low to High', value: { sortBy: 'price', sortOrder: 'asc' } },
    { label: 'Price: High to Low', value: { sortBy: 'price', sortOrder: 'desc' } },
    { label: 'Name: A to Z', value: { sortBy: 'name', sortOrder: 'asc' } },
    { label: 'Name: Z to A', value: { sortBy: 'name', sortOrder: 'desc' } },
  ];

  // Pagination
  pagination: PaginationOptions = { page: 1, limit: 12 };
  totalProducts = 0;
  totalPages = 0;

  // Price range
  minPrice = 0;
  maxPrice = 1000;
  priceRange = { min: 0, max: 1000 };

  // Mobile filter toggle
  showMobileFilters = false;

  private destroy$ = new Subject<void>();

  // Make Math available in template
  Math = Math;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.filters.search = query || undefined;
        this.pagination.page = 1;
        this.loadProducts();
      });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService
      .getProducts(this.filters, this.sortOptions, this.pagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.products = response.data;
          this.totalProducts = response.total;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
          console.error('Error loading products:', err);
        },
      });
  }

  loadCategories(): void {
    this.productService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
        },
      });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  onCategoryChange(categoryId: string): void {
    this.filters.categoryId = categoryId || undefined;
    this.pagination.page = 1;
    this.loadProducts();
  }

  onPriceRangeChange(): void {
    this.filters.minPrice = this.priceRange.min > 0 ? this.priceRange.min : undefined;
    this.filters.maxPrice = this.priceRange.max < 1000 ? this.priceRange.max : undefined;
    this.pagination.page = 1;
    this.loadProducts();
  }

  onSortChange(option: any): void {
    this.sortOptions = option;
    this.pagination.page = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || product.images[0],
    });
  }

  clearFilters(): void {
    this.filters = {};
    this.searchQuery = '';
    this.priceRange = { min: 0, max: 1000 };
    this.pagination.page = 1;
    this.loadProducts();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.pagination.page - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
