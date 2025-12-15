import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>

        <form (ngSubmit)="onSubmit()" #forgotForm="ngForm" *ngIf="!emailSent">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              placeholder="your@email.com"
              required
              email
              #emailInput="ngModel"
            />
            <span class="error" *ngIf="emailInput.invalid && emailInput.touched">
              Please enter a valid email
            </span>
          </div>

          <button type="submit" class="btn-primary" [disabled]="forgotForm.invalid || isLoading">
            <span *ngIf="!isLoading">Send Reset Link</span>
            <span *ngIf="isLoading">Sending...</span>
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="success-message" *ngIf="emailSent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3>Check Your Email</h3>
          <p>
            We've sent a password reset link to <strong>{{ email }}</strong
            >. Please check your inbox and follow the instructions.
          </p>
          <button class="btn-secondary" (click)="emailSent = false">Send Another Link</button>
        </div>

        <div class="auth-footer">
          <p><a routerLink="/auth/login" class="link">Back to login</a></p>
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

      input[type='email'] {
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

      .error {
        display: block;
        color: var(--semantic-error);
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      .btn-primary {
        width: 100%;
        padding: 1rem;
        background: var(--gradient-primary);
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

      .btn-secondary {
        width: 100%;
        padding: 1rem;
        background: transparent;
        color: var(--primary-cyan);
        border: 1px solid var(--primary-cyan);
        border-radius: var(--radius-md);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        margin-top: 1rem;
      }

      .btn-secondary:hover {
        background: rgba(0, 217, 255, 0.1);
        transform: translateY(-2px);
      }

      .link {
        color: var(--primary-cyan);
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 500;
        transition: color var(--transition-fast);
      }

      .link:hover {
        color: var(--primary-cyan);
        opacity: 0.8;
      }

      .error-message {
        margin-top: 1rem;
        padding: 0.875rem;
        background: rgba(255, 59, 92, 0.1);
        border: 1px solid var(--semantic-error);
        border-radius: var(--radius-md);
        color: var(--semantic-error);
        font-size: 0.95rem;
        text-align: center;
      }

      .success-message {
        text-align: center;
        padding: 2rem 0;
      }

      .success-message svg {
        width: 64px;
        height: 64px;
        color: var(--primary-cyan);
        stroke-width: 2;
        margin-bottom: 1.5rem;
      }

      .success-message h3 {
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 700;
      }

      .success-message p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0 0 1.5rem 0;
      }

      .success-message strong {
        color: var(--text-primary);
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
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  isLoading = false;
  errorMessage = '';
  emailSent = false;

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.emailSent = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to send reset link. Please try again.';
      },
    });
  }
}
