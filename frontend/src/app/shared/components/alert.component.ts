import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'alert alert-' + type" [class.alert-dismissible]="dismissible">
      <div class="alert-content">
        <span class="alert-icon">{{ getIcon() }}</span>
        <div class="alert-message">
          <ng-content></ng-content>
        </div>
      </div>
      @if (dismissible) {
      <button class="alert-close" (click)="onClose()">×</button>
      }
    </div>
  `,
  styles: [
    `
      .alert {
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
      }

      .alert-content {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        flex: 1;
      }

      .alert-icon {
        font-size: 1.25rem;
        line-height: 1;
      }

      .alert-message {
        flex: 1;
      }

      .alert-info {
        border-color: var(--border-cyan);
        box-shadow: var(--shadow-glow-cyan);
        color: var(--primary-cyan);
      }

      .alert-success {
        border-color: var(--semantic-success);
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
        color: var(--semantic-success);
      }

      .alert-warning {
        border-color: var(--semantic-warning);
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.2);
        color: var(--semantic-warning);
      }

      .alert-error {
        border-color: var(--border-error);
        box-shadow: var(--shadow-glow-error);
        color: var(--semantic-error);
      }

      .alert-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
        color: var(--text-muted);
        transition: all var(--transition-base);
      }

      .alert-close:hover {
        color: var(--text-primary);
        transform: scale(1.2);
      }
    `,
  ],
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() dismissible: boolean = false;
  @Output() closed = new EventEmitter<void>();

  getIcon(): string {
    switch (this.type) {
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      case 'error':
        return '✕';
      default:
        return 'ℹ️';
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
