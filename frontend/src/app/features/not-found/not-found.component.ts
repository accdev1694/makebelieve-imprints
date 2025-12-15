import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a routerLink="/home" class="home-link">Go to Home</a>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        padding: 2rem;
        text-align: center;
        margin-top: 4rem;
      }
      h1 {
        color: #e74c3c;
        margin-bottom: 1rem;
        font-size: 2.5rem;
      }
      p {
        color: #666;
        margin-bottom: 2rem;
      }
      .home-link {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s;
      }
      .home-link:hover {
        background-color: #2980b9;
      }
    `,
  ],
})
export class NotFoundComponent {}
