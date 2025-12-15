import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  template: `
    <div class="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Manage products, orders, and customers.</p>
    </div>
  `,
  styles: [
    `
      .admin-container {
        padding: 2rem;
      }
      h1 {
        color: #333;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class AdminComponent {}
