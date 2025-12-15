import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="theme-switcher"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      title="{{ isDark() ? 'Switch to light mode' : 'Switch to dark mode' }}"
    >
      <div class="switcher-track">
        <div class="switcher-thumb" [class.light]="!isDark()">
          <!-- Sun Icon (Light Mode) -->
          <svg
            *ngIf="!isDark()"
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>

          <!-- Moon Icon (Dark Mode) -->
          <svg
            *ngIf="isDark()"
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </div>
      </div>
    </button>
  `,
  styles: [
    `
      .theme-switcher {
        position: relative;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        outline: none;
        transition: transform var(--transition-fast);
      }

      .theme-switcher:hover {
        transform: scale(1.05);
      }

      .theme-switcher:active {
        transform: scale(0.95);
      }

      .switcher-track {
        position: relative;
        width: 42px;
        height: 24px;
        background: var(--surface);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-full);
        transition: all var(--transition-base);
        overflow: hidden;
      }

      .theme-switcher:hover .switcher-track {
        background: var(--surface-hover);
        border-color: var(--primary-cyan);
        box-shadow: 0 0 12px rgba(0, 217, 255, 0.2);
      }

      .switcher-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-base);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .switcher-thumb.light {
        left: 22px;
        background: linear-gradient(135deg, var(--semantic-warning), var(--semantic-error));
      }

      .icon {
        width: 10px;
        height: 10px;
        color: white;
        animation: iconFade 0.3s ease;
      }

      @keyframes iconFade {
        0% {
          opacity: 0;
          transform: rotate(-30deg) scale(0.8);
        }
        100% {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }
      }

      /* Add glow effect on dark theme */
      :root[data-theme='dark'] .switcher-track {
        box-shadow: inset 0 0 8px rgba(0, 217, 255, 0.1);
      }

      :root[data-theme='light'] .switcher-track {
        box-shadow: inset 0 0 8px rgba(255, 138, 0, 0.1);
      }
    `,
  ],
})
export class ThemeSwitcherComponent {
  private themeService = inject(ThemeService);

  isDark = computed(() => this.themeService.theme() === 'dark');

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
