import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>
      <p>Complete your order and payment information.</p>
    </div>
  `,
  styles: [
    `
      .checkout-container {
        padding: 2rem;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class CheckoutComponent {}
