import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="credentials.email"
              placeholder="your@email.com"
              required
              email
              #emailInput="ngModel"
            />
            <span class="error" *ngIf="emailInput.invalid && emailInput.touched">
              Please enter a valid email
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-wrapper">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="credentials.password"
                placeholder="••••••••"
                required
                minlength="6"
                #passwordInput="ngModel"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="showPassword = !showPassword"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <span class="error" *ngIf="passwordInput.invalid && passwordInput.touched">
              Password must be at least 6 characters
            </span>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span>Remember me</span>
            </label>
            <a routerLink="/auth/forgot-password" class="link">Forgot password?</a>
          </div>

          <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading">Signing in...</span>
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register" class="link">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--bg-primary);
      }

      .auth-card {
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        padding: 3rem;
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-primary);
        width: 100%;
        max-width: 450px;
      }

      .auth-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .auth-header h2 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
        font-size: 2rem;
        font-weight: 700;
      }

      .auth-header p {
        color: var(--text-secondary);
        margin: 0;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 0.95rem;
      }

      input[type='email'],
      input[type='password'] {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        font-size: 1rem;
        background: #ffffff;
        color: #1a1a1a;
        transition: all var(--transition-base);
        box-sizing: border-box;
      }

      input::placeholder {
        color: var(--text-muted);
      }

      input:focus {
        outline: none;
        border-color: var(--primary-cyan);
        background: var(--surface-hover);
      }

      .password-input-wrapper {
        position: relative;
      }

      .password-toggle {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        color: var(--text-secondary);
        transition: color var(--transition-fast);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .password-toggle:hover {
        color: var(--primary-cyan);
      }

      .password-toggle svg {
        width: 20px;
        height: 20px;
        stroke-width: 2;
      }

      .error {
        display: block;
        color: var(--secondary-red);
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.95rem;
        color: var(--text-secondary);
      }

      .checkbox-label input[type='checkbox'] {
        width: auto;
        cursor: pointer;
      }

      .btn-primary {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
        color: white;
        border: none;
        border-radius: var(--radius-md);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        opacity: 0.9;
      }

      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .link {
        color: var(--primary-cyan);
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 500;
        transition: color var(--transition-fast);
      }

      .link:hover {
        color: var(--primary-blue);
      }

      .error-message {
        margin-top: 1rem;
        padding: 0.875rem;
        background: rgba(255, 59, 92, 0.1);
        border: 1px solid var(--secondary-red);
        border-radius: var(--radius-md);
        color: var(--secondary-red);
        font-size: 0.95rem;
        text-align: center;
      }

      .auth-footer {
        margin-top: 2rem;
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-secondary);
      }

      .auth-footer p {
        color: var(--text-secondary);
        margin: 0;
      }

      @media (max-width: 768px) {
        .auth-card {
          padding: 2rem;
        }
      }
    `,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: '',
  };
  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
