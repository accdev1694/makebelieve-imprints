import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../models';
import { ProductCardComponent } from '../../../shared/components/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCardComponent,
    LoadingSpinnerComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = false;
  error: string | null = null;

  selectedImageIndex = 0;
  quantity = 1;
  selectedSize?: string;
  selectedColor?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.error = null;
          return this.productService.getProduct(params['id']);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
          this.loadRelatedProducts(product.id);
        },
        error: (err) => {
          this.error = 'Failed to load product. Please try again.';
          this.loading = false;
          console.error('Error loading product:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRelatedProducts(productId: string): void {
    this.productService
      .getRelatedProducts(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.relatedProducts = products;
        },
        error: (err) => {
          console.error('Error loading related products:', err);
        },
      });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addItem({
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      imageUrl: this.product.imageUrl || this.product.images[0],
      customization: {
        size: this.selectedSize,
        color: this.selectedColor,
      },
    });
  }

  onRelatedProductAddToCart(product: Product): void {
    this.cartService.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || product.images[0],
    });
  }

  get images(): string[] {
    if (!this.product) return [];
    if (this.product.images && this.product.images.length > 0) {
      return this.product.images;
    }
    return this.product.imageUrl ? [this.product.imageUrl] : [];
  }

  get selectedImage(): string {
    return this.images[this.selectedImageIndex] || '/assets/placeholder-product.png';
  }

  get isInStock(): boolean {
    return this.product ? this.product.stock > 0 : false;
  }

  get canAddToCart(): boolean {
    return this.isInStock && this.quantity <= (this.product?.stock || 0);
  }
}
