import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
    <div class="modal-overlay" (click)="onOverlayClick()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          @if (closeable) {
          <button class="modal-close" (click)="close()">×</button>
          }
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        @if (hasFooter) {
        <div class="modal-footer">
          <ng-content select="[footer]"></ng-content>
        </div>
        }
      </div>
    </div>
    }
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(10, 10, 15, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
      }

      .modal-container {
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-cyan);
        border-radius: var(--radius-xl);
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-glow-cyan);
      }
      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-primary);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        color: var(--text-muted);
        transition: all var(--transition-base);
      }

      .modal-close:hover {
        color: var(--primary-cyan);
        transform: scale(1.2);
      }

      .modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1;
        color: var(--text-secondary);
      }

      .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-primary);
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }
    `,
  ],
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() closeable: boolean = true;
  @Input() hasFooter: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(): void {
    if (this.closeable) {
      this.close();
    }
  }
}
