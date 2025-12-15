import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../../models';

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  customizable?: boolean;
}

export interface ProductSortOptions {
  sortBy: 'price' | 'name' | 'createdAt' | 'rating';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private categoriesUrl = `${environment.apiUrl}/categories`;

  // State management for filters
  private filtersSubject = new BehaviorSubject<ProductFilters>({});
  public filters$ = this.filtersSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all products with optional filters, sorting, and pagination
   */
  getProducts(
    filters?: ProductFilters,
    sort?: ProductSortOptions,
    pagination?: PaginationOptions
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();

    // Add filters
    if (filters) {
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
      if (filters.minPrice !== undefined)
        params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined)
        params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.customizable !== undefined)
        params = params.set('customizable', filters.customizable.toString());
      if (filters.tags && filters.tags.length > 0) {
        params = params.set('tags', filters.tags.join(','));
      }
    }

    // Add sorting
    if (sort) {
      params = params.set('sortBy', sort.sortBy);
      params = params.set('sortOrder', sort.sortOrder);
    }

    // Add pagination
    if (pagination) {
      params = params.set('page', pagination.page.toString());
      params = params.set('limit', pagination.limit.toString());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => response.data) // Extract data from wrapper
    );
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data.product) // Extract product from wrapper
    );
  }

  /**
   * Get products by category ID
   */
  getProductsByCategory(
    categoryId: string,
    pagination?: PaginationOptions
  ): Observable<PaginatedResponse<Product>> {
    return this.getProducts({ categoryId }, undefined, pagination);
  }

  /**
   * Search products with debouncing
   */
  searchProducts(
    query: string,
    pagination?: PaginationOptions
  ): Observable<PaginatedResponse<Product>> {
    return this.getProducts({ search: query }, undefined, pagination);
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<any[]> {
    return this.http
      .get<any>(this.categoriesUrl)
      .pipe(map((response) => response.data.categories || response.data || []));
  }

  /**
   * Get related products for a given product
   */
  getRelatedProducts(productId: string, limit: number = 4): Observable<Product[]> {
    return this.http
      .get<any>(`${this.apiUrl}/${productId}/related`, {
        params: { limit: limit.toString() },
      })
      .pipe(map((response) => response.data || []));
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    let params = new HttpParams().set('featured', 'true').set('limit', limit.toString());
    return this.http
      .get<any>(this.apiUrl, { params })
      .pipe(map((response) => response.data?.data || []));
  }

  /**
   * Update active filters
   */
  updateFilters(filters: ProductFilters): void {
    this.filtersSubject.next(filters);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filtersSubject.next({});
  }

  /**
   * Get current filters
   */
  getCurrentFilters(): ProductFilters {
    return this.filtersSubject.value;
  }
}
