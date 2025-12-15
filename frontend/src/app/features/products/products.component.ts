import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  template: `
    <div class="products-container">
      <h1>Products</h1>
      <p>Browse our collection of customizable products.</p>
    </div>
  `,
  styles: [
    `
      .products-container {
        padding: 2rem;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class ProductsComponent {}
