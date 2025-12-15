import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [class.fullscreen]="fullscreen">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size">
        <div class="spinner-circle"></div>
      </div>
      @if (message) {
      <p class="spinner-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [
    `
      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .spinner-container.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10, 10, 15, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 9999;
      }

      .spinner {
        position: relative;
      }

      .spinner-circle {
        width: 100%;
        height: 100%;
        border: 3px solid var(--surface);
        border-top: 3px solid var(--primary-cyan);
        border-right: 3px solid var(--secondary-red);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        box-shadow: var(--glow-cyan);
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .spinner-message {
        margin-top: 1rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() message: string = '';
  @Input() fullscreen: boolean = false;
}
