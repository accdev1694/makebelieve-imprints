import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>
      <p>Your cart items will appear here.</p>
    </div>
  `,
  styles: [
    `
      .cart-container {
        padding: 2rem;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class CartComponent {}
