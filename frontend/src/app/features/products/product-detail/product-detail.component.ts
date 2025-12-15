import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  template: `
    <div class="product-detail-container">
      <h1>Product Details</h1>
      <p>Product customization and details will be shown here.</p>
    </div>
  `,
  styles: [
    `
      .product-detail-container {
        padding: 2rem;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class ProductDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
