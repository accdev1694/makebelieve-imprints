import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header.component';
import { FooterComponent } from '../shared/components/footer.component';
import { ThemeSwitcherComponent } from '../shared/components/theme-switcher.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ThemeSwitcherComponent],
  template: `
    <div class="layout-container">
      <div class="theme-switcher-fixed">
        <app-theme-switcher></app-theme-switcher>
      </div>
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .layout-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .theme-switcher-fixed {
        position: fixed;
        top: 7.2rem;
        right: -0.15rem;
        z-index: 1000;
        transform: rotate(90deg);
        transform-origin: center;
      }

      .main-content {
        flex: 1;
      }

      @media (max-width: 768px) {
        .theme-switcher-fixed {
          top: 1rem;
          right: 1rem;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {}
