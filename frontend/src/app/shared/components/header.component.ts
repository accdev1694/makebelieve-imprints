import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="header">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <img src="/logo.png" alt="MakeBelieve Imprints" class="logo-image" />
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-desktop">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >
            Home
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-link">Products</a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">About</a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>
        </nav>

        <!-- Search Bar -->
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            class="search-input"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
          />
        </div>

        <!-- Actions -->
        <div class="actions">
          <!-- Cart -->
          <button class="action-btn cart-btn" routerLink="/cart" title="Shopping Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span *ngIf="cartItemCount() > 0" class="cart-badge">{{ cartItemCount() }}</span>
          </button>

          <!-- User Menu -->
          <div class="user-menu" *ngIf="isAuthenticated(); else loginButton">
            <button class="action-btn user-btn" (click)="toggleUserDropdown()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div class="dropdown-menu" *ngIf="showUserDropdown()">
              <a routerLink="/account" class="dropdown-item" (click)="closeUserDropdown()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Account
              </a>
              <a routerLink="/orders" class="dropdown-item" (click)="closeUserDropdown()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                  ></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Orders
              </a>
              <a
                *ngIf="isAdmin()"
                routerLink="/admin"
                class="dropdown-item"
                (click)="closeUserDropdown()"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Admin Panel
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" (click)="onLogout()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>

          <ng-template #loginButton>
            <a routerLink="/auth/register" class="btn-register">Sign Up</a>
            <a routerLink="/auth/login" class="btn-login">Login</a>
          </ng-template>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <svg *ngIf="!showMobileMenu()" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg *ngIf="showMobileMenu()" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <nav class="nav-mobile" *ngIf="showMobileMenu()">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-link-mobile"
          (click)="closeMobileMenu()"
        >
          Home
        </a>
        <a
          routerLink="/products"
          routerLinkActive="active"
          class="nav-link-mobile"
          (click)="closeMobileMenu()"
        >
          Products
        </a>
        <a
          routerLink="/about"
          routerLinkActive="active"
          class="nav-link-mobile"
          (click)="closeMobileMenu()"
        >
          About
        </a>
        <a
          routerLink="/contact"
          routerLinkActive="active"
          class="nav-link-mobile"
          (click)="closeMobileMenu()"
        >
          Contact
        </a>
      </nav>
    </header>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--border-primary);
        box-shadow: var(--shadow-md);
      }

      .header-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0.5rem 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      /* Logo */
      .logo {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: transform var(--transition-fast);
      }

      .logo:hover {
        transform: scale(1.05);
      }

      .logo-image {
        height: 100px;
        width: auto;
      }

      /* Desktop Navigation */
      .nav-desktop {
        display: flex;
        gap: 2rem;
        margin-right: auto;
      }

      .nav-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
        transition: all var(--transition-fast);
        position: relative;
        padding: 0.5rem 0;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--gradient-primary);
        transition: width var(--transition-base);
      }

      .nav-link:hover,
      .nav-link.active {
        color: var(--primary-cyan);
      }

      .nav-link.active::after,
      .nav-link:hover::after {
        width: 100%;
      }

      /* Search Bar */
      .search-bar {
        position: relative;
        flex: 1;
        max-width: 400px;
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: var(--text-tertiary);
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 3rem;
        background: var(--surface);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-full);
        color: var(--text-primary);
        font-size: 0.95rem;
        transition: all var(--transition-base);
      }

      .search-input::placeholder {
        color: var(--text-muted);
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary-cyan);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
        background: var(--surface-hover);
      }

      /* Actions */
      .actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .action-btn {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        background: var(--surface);
        border: 1px solid var(--border-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .action-btn svg {
        width: 20px;
        height: 20px;
        color: var(--text-secondary);
        stroke-width: 2;
      }

      .action-btn:hover {
        background: var(--surface-hover);
        border-color: var(--primary-cyan);
        box-shadow: 0 0 12px rgba(0, 217, 255, 0.2);
      }

      /* Cart Badge */
      .cart-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: var(--gradient-error);
        color: white;
        font-size: 0.7rem;
        font-weight: 700;
        min-width: 20px;
        height: 20px;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        box-shadow: var(--shadow-glow-error);
      }

      /* User Menu */
      .user-menu {
        position: relative;
      }

      .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        min-width: 220px;
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-xl);
        padding: 0.5rem;
        animation: dropdownFadeIn 0.2s ease;
      }

      @keyframes dropdownFadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 500;
        transition: all var(--transition-fast);
        cursor: pointer;
        border: none;
        background: transparent;
        width: 100%;
        text-align: left;
      }

      .dropdown-item svg {
        width: 18px;
        height: 18px;
        stroke-width: 2;
      }

      .dropdown-item:hover {
        background: var(--surface-hover);
        color: var(--primary-cyan);
      }

      .dropdown-item.logout {
        color: var(--semantic-error);
      }

      .dropdown-item.logout:hover {
        background: rgba(255, 59, 92, 0.1);
      }

      .dropdown-divider {
        height: 1px;
        background: var(--border-secondary);
        margin: 0.5rem 0;
      }

      /* Login & Register Buttons */
      .btn-register {
        padding: 0.625rem 1.5rem;
        background: transparent;
        color: var(--primary-cyan);
        border: 1px solid var(--primary-cyan);
        border-radius: var(--radius-full);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all var(--transition-base);
      }

      .btn-register:hover {
        background: var(--primary-cyan);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3);
      }

      .btn-login {
        padding: 0.625rem 1.5rem;
        background: var(--gradient-primary);
        color: white;
        border-radius: var(--radius-full);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all var(--transition-base);
        box-shadow: var(--shadow-glow-cyan);
      }

      .btn-login:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3);
      }

      /* Mobile Menu Button */
      .mobile-menu-btn {
        display: none;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        background: var(--surface);
        border: 1px solid var(--border-primary);
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .mobile-menu-btn svg {
        width: 24px;
        height: 24px;
        color: var(--text-primary);
        stroke-width: 2;
      }

      .mobile-menu-btn:hover {
        background: var(--surface-hover);
        border-color: var(--primary-cyan);
      }

      /* Mobile Navigation */
      .nav-mobile {
        display: none;
        flex-direction: column;
        padding: 1rem 2rem 2rem;
        gap: 0.5rem;
        border-top: 1px solid var(--border-secondary);
        animation: mobileMenuSlide 0.3s ease;
      }

      @keyframes mobileMenuSlide {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .nav-link-mobile {
        padding: 1rem;
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
      }

      .nav-link-mobile:hover,
      .nav-link-mobile.active {
        background: var(--surface-hover);
        color: var(--primary-cyan);
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .search-bar {
          max-width: 300px;
        }
      }

      @media (max-width: 768px) {
        .header-container {
          padding: 1rem;
          gap: 1rem;
        }

        .nav-desktop {
          display: none;
        }

        .search-bar {
          display: none;
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-mobile {
          display: flex;
        }

        .logo-image {
          height: 75px;
        }

        .actions {
          margin-left: auto;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  searchQuery = signal('');
  showUserDropdown = signal(false);
  showMobileMenu = signal(false);

  isAuthenticated = this.authService.isAuthenticated;
  isAdmin = computed(() => this.authService.user()?.role === 'admin');
  cartItemCount = this.cartService.totalItems;

  toggleUserDropdown(): void {
    this.showUserDropdown.update((v) => !v);
  }

  closeUserDropdown(): void {
    this.showUserDropdown.set(false);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  onSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.closeUserDropdown();
    this.router.navigate(['/']);
  }
}
