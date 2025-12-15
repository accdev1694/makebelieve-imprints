import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumb">
      <ol class="breadcrumb-list">
        @for (item of items; track item.label; let isLast = $last) {
        <li class="breadcrumb-item">
          @if (!isLast && item.url) {
          <a [routerLink]="item.url">{{ item.label }}</a>
          } @else {
          <span>{{ item.label }}</span>
          } @if (!isLast) {
          <span class="breadcrumb-separator">/</span>
          }
        </li>
        }
      </ol>
    </nav>
  `,
  styles: [
    `
      .breadcrumb {
        padding: 0.75rem 0;
        margin-bottom: 1rem;
      }

      .breadcrumb-list {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin: 0;
        gap: 0.5rem;
        align-items: center;
      }

      .breadcrumb-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      .breadcrumb-item a {
        color: var(--primary-cyan);
        text-decoration: none;
        transition: all var(--transition-base);
        font-weight: var(--font-weight-medium);
      }

      .breadcrumb-item a:hover {
        color: var(--primary-blue);
        text-shadow: var(--glow-cyan);
      }

      .breadcrumb-item span {
        color: var(--text-secondary);
      }

      .breadcrumb-separator {
        color: var(--text-muted);
      }
    `,
  ],
})
export class BreadcrumbComponent {
  @Input() items: Breadcrumb[] = [];
}
