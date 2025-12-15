import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Verify Your Email</h2>
          <p>
            We've sent a 6-digit code to <strong>{{ email }}</strong>
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" *ngIf="!verified">
          <div class="code-input-group">
            <input
              *ngFor="let digit of codeDigits; let i = index"
              type="text"
              maxlength="1"
              [(ngModel)]="codeDigits[i]"
              [name]="'code-' + i"
              class="code-input"
              (input)="onCodeInput($event, i)"
              (keydown)="onKeyDown($event, i)"
              #codeInput
              [attr.data-index]="i"
            />
          </div>

          <button type="submit" class="btn-primary" [disabled]="!isCodeComplete() || isLoading">
            <span *ngIf="!isLoading">Verify Email</span>
            <span *ngIf="isLoading">Verifying...</span>
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="resend-section">
            <p *ngIf="canResend">
              Didn't receive the code?
              <button type="button" class="link-button" (click)="resendCode()">Resend</button>
            </p>
            <p *ngIf="!canResend && resendTimer > 0" class="timer-text">
              Resend code in {{ resendTimer }}s
            </p>
          </div>
        </form>

        <div class="success-message" *ngIf="verified">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3>Email Verified!</h3>
          <p>Your email has been successfully verified. You can now access your account.</p>
          <button class="btn-primary" (click)="goToLogin()">Continue to Login</button>
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
        max-width: 500px;
      }

      .auth-header {
        text-align: center;
        margin-bottom: 2.5rem;
      }

      .auth-header h2 {
        margin: 0 0 0.75rem 0;
        color: var(--text-primary);
        font-size: 2rem;
        font-weight: 700;
      }

      .auth-header p {
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
      }

      .auth-header strong {
        color: var(--primary-cyan);
      }

      .code-input-group {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        margin-bottom: 2rem;
      }

      .code-input {
        width: 3.5rem;
        height: 3.5rem;
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
        border: 2px solid var(--border-primary);
        border-radius: var(--radius-md);
        background: #ffffff;
        color: #1a1a1a;
        transition: all var(--transition-fast);
      }

      .code-input:focus {
        outline: none;
        border-color: var(--primary-cyan);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
      }

      .code-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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

      .resend-section {
        margin-top: 1.5rem;
        text-align: center;
      }

      .resend-section p {
        color: var(--text-secondary);
        font-size: 0.95rem;
        margin: 0;
      }

      .link-button {
        background: none;
        border: none;
        color: var(--primary-cyan);
        cursor: pointer;
        font-weight: 600;
        font-size: 0.95rem;
        padding: 0;
        transition: color var(--transition-fast);
      }

      .link-button:hover {
        color: var(--primary-blue);
        text-decoration: underline;
      }

      .timer-text {
        color: var(--text-muted);
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

        .code-input {
          width: 2.75rem;
          height: 2.75rem;
          font-size: 1.25rem;
        }

        .code-input-group {
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class EmailVerificationComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  codeDigits: string[] = ['', '', '', '', '', ''];
  isLoading = false;
  errorMessage = '';
  verified = false;
  canResend = false;
  resendTimer = 60;
  private timerInterval: any;

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'] || 'your email';
    this.startResendTimer();
  }

  onCodeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const nextInput = document.querySelector(
        `input[data-index="${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[data-index="${index - 1}"]`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  isCodeComplete(): boolean {
    return this.codeDigits.every((digit) => digit.length === 1);
  }

  getCode(): string {
    return this.codeDigits.join('');
  }

  onSubmit(): void {
    if (!this.isCodeComplete()) return;

    this.isLoading = true;
    this.errorMessage = '';

    const code = this.getCode();

    this.authService.verifyEmail(code).subscribe({
      next: () => {
        this.isLoading = false;
        this.verified = true;
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid verification code. Please try again.';
        this.codeDigits = ['', '', '', '', '', ''];
        const firstInput = document.querySelector('input[data-index="0"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      },
    });
  }

  resendCode(): void {
    this.canResend = false;
    this.resendTimer = 60;
    this.errorMessage = '';

    // TODO: Implement resend verification
    console.log('Resend verification not yet implemented');
    this.startResendTimer();
  }

  startResendTimer(): void {
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.canResend = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
