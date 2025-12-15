import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="'btn btn-' + variant"
      [class.btn-loading]="loading"
      [class.btn-block]="block"
      (click)="handleClick($event)"
    >
      @if (loading) {
      <span class="spinner-small"></span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      .btn {
        padding: 0.875rem 2rem;
        font-size: 1rem;
        font-weight: var(--font-weight-semibold);
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: all var(--transition-base);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        white-space: nowrap;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .btn-primary {
        background: var(--gradient-primary);
        color: var(--text-primary);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
      }

      .btn-secondary {
        background: var(--gradient-secondary);
        color: var(--text-primary);
      }

      .btn-secondary:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
      }

      .btn-danger {
        background: var(--gradient-secondary);
        color: var(--text-primary);
      }

      .btn-danger:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
      }

      .btn-success {
        background: var(--gradient-primary);
        color: var(--text-primary);
      }

      .btn-success:hover:not(:disabled) {
        transform: translateY(-2px) scale(1.02);
      }

      .btn-outline {
        background-color: transparent;
        color: var(--primary-cyan);
        border: 1px solid var(--primary-cyan);
      }

      .btn-outline:hover:not(:disabled) {
        background: rgba(0, 217, 255, 0.1);
        box-shadow: var(--glow-cyan);
        border-color: var(--primary-cyan);
      }

      .btn-block {
        width: 100%;
      }

      .spinner-small {
        width: 16px;
        height: 16px;
        border: 2px solid var(--surface);
        border-top: 2px solid var(--primary-cyan);
        border-right: 2px solid var(--secondary-red);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() type: ButtonType = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() block: boolean = false;
  @Output() clicked = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
