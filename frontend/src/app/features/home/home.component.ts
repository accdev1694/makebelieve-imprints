import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  color: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="home-container">
      <section class="hero">
        <h1 class="hero-title">Welcome to MakeBelieve Imprints</h1>
        <p class="hero-subtitle">
          Transform Your Ideas Into Reality with Custom Printing & Sublimation
        </p>
        <div class="cta-buttons">
          <a routerLink="/products" class="btn-primary">Explore Products</a>
          <a routerLink="/auth/register" class="btn-secondary">Get Started</a>
        </div>
      </section>

      <!-- Featured Products Carousel -->
      <section class="featured-products">
        <h2 class="section-title">Featured Products</h2>
        <p class="section-subtitle">Our most popular customizable items</p>

        <div class="carousel-container">
          <button
            class="carousel-btn carousel-btn-prev"
            (click)="previousSlide()"
            [disabled]="currentSlide() === 0"
            aria-label="Previous products"
          >
            ←
          </button>

          <div class="carousel-track">
            <div
              class="carousel-inner"
              [style.transform]="'translateX(-' + currentSlide() * 100 + '%)'"
            >
              @for (product of featuredProducts; track product.id) {
              <div class="product-card">
                <div class="product-image">
                  <img [src]="product.image" [alt]="product.name" />
                  <span class="product-category">{{ product.category }}</span>
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-price">\${{ product.price.toFixed(2) }}</p>
                  <a [routerLink]="['/products', product.id]" class="btn-customize">
                    Customize Now
                  </a>
                </div>
              </div>
              }
            </div>
          </div>

          <button
            class="carousel-btn carousel-btn-next"
            (click)="nextSlide()"
            [disabled]="currentSlide() >= maxSlide()"
            aria-label="Next products"
          >
            →
          </button>
        </div>

        <div class="carousel-indicators">
          @for (dot of carouselDots(); track $index) {
          <button
            class="indicator-dot"
            [class.active]="currentSlide() === $index"
            (click)="goToSlide($index)"
            [attr.aria-label]="'Go to slide ' + ($index + 1)"
          ></button>
          }
        </div>
      </section>

      <!-- Category Showcase -->
      <section class="categories">
        <h2 class="section-title">Shop by Category</h2>
        <p class="section-subtitle">Explore our wide range of customizable products</p>

        <div class="category-grid">
          @for (category of categories; track category.id) {
          <a
            [routerLink]="['/products']"
            [queryParams]="{ category: category.id }"
            class="category-card"
            [attr.data-color]="category.color"
          >
            <div class="category-icon" [innerHTML]="category.icon"></div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-footer">
              <span class="product-count">{{ category.productCount }}+ products</span>
              <span class="arrow">→</span>
            </div>
          </a>
          }
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials">
        <h2 class="section-title">What Our Customers Say</h2>
        <p class="section-subtitle">Real reviews from real customers</p>

        <div class="testimonials-carousel">
          <button
            class="carousel-btn carousel-btn-prev"
            (click)="previousTestimonial()"
            [disabled]="currentTestimonial() === 0"
            aria-label="Previous testimonial"
          >
            ←
          </button>

          <div class="testimonials-track">
            <div
              class="testimonials-inner"
              [style.transform]="'translateX(-' + currentTestimonial() * 100 + '%)'"
            >
              @for (testimonial of testimonials; track testimonial.id) {
              <div class="testimonial-card">
                <div class="testimonial-header">
                  <img [src]="testimonial.avatar" [alt]="testimonial.name" class="avatar" />
                  <div class="testimonial-info">
                    <h4 class="testimonial-name">{{ testimonial.name }}</h4>
                    <p class="testimonial-role">
                      {{ testimonial.role }} at {{ testimonial.company }}
                    </p>
                  </div>
                </div>
                <div class="rating">
                  @for (star of [1,2,3,4,5]; track star) {
                  <span class="star" [class.filled]="star <= testimonial.rating">★</span>
                  }
                </div>
                <p class="testimonial-text">"{{ testimonial.text }}"</p>
                <p class="testimonial-date">{{ testimonial.date }}</p>
              </div>
              }
            </div>
          </div>

          <button
            class="carousel-btn carousel-btn-next"
            (click)="nextTestimonial()"
            [disabled]="currentTestimonial() >= testimonials.length - 1"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        <div class="carousel-indicators">
          @for (dot of testimonials; track dot.id) {
          <button
            class="indicator-dot"
            [class.active]="currentTestimonial() === $index"
            (click)="goToTestimonial($index)"
            [attr.aria-label]="'Go to testimonial ' + ($index + 1)"
          ></button>
          }
        </div>
      </section>

      <!-- Call-to-Action Sections -->
      <section class="cta-sections">
        <!-- CTA 1: Quick Order -->
        <div class="cta-card cta-primary">
          <div class="cta-content">
            <div class="cta-icon">⚡</div>
            <h3 class="cta-title">Need It Fast?</h3>
            <p class="cta-description">
              Rush orders available! Get your custom products delivered in as little as 48 hours.
              Perfect for last-minute events and urgent needs.
            </p>
            <a routerLink="/products" class="cta-button cta-button-light">
              Order Now
              <span class="arrow-icon">→</span>
            </a>
          </div>
          <div class="cta-visual">
            <div class="cta-badge">48hr</div>
            <div class="cta-badge-label">Express</div>
          </div>
        </div>

        <!-- CTA 2: Bulk Orders -->
        <div class="cta-card cta-secondary">
          <div class="cta-content">
            <div class="cta-icon">📦</div>
            <h3 class="cta-title">Bulk Order Discounts</h3>
            <p class="cta-description">
              Save up to 30% on orders of 50+ items. Perfect for corporate events, team gifts, or
              reselling. Contact us for a custom quote.
            </p>
            <a routerLink="/contact" class="cta-button cta-button-outline">
              Get a Quote
              <span class="arrow-icon">→</span>
            </a>
          </div>
          <div class="cta-visual">
            <div class="cta-percentage">30%</div>
            <div class="cta-percentage-label">OFF</div>
          </div>
        </div>

        <!-- CTA 3: Design Service -->
        <div class="cta-card cta-tertiary">
          <div class="cta-content">
            <div class="cta-icon">🎨</div>
            <h3 class="cta-title">Free Design Help</h3>
            <p class="cta-description">
              Not sure how to design? Our expert team offers free design consultations and can help
              bring your vision to life.
            </p>
            <a routerLink="/contact" class="cta-button cta-button-gradient">
              Get Design Help
              <span class="arrow-icon">→</span>
            </a>
          </div>
          <div class="cta-visual">
            <div class="cta-icon-large">✨</div>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="feature-card card-purple">
          <div class="feature-icon">🎨</div>
          <h3>Custom Products</h3>
          <p>
            Design your own mugs, t-shirts, phone cases, and more with our easy-to-use customization
            tools
          </p>
          <a routerLink="/products" class="feature-link">Customize Now →</a>
        </div>
        <div class="feature-card card-pink">
          <div class="feature-icon">📄</div>
          <h3>Stationery Printing</h3>
          <p>Professional business cards, letterheads, flyers, and marketing materials</p>
          <a routerLink="/products" class="feature-link">View Options →</a>
        </div>
        <div class="feature-card card-blue">
          <div class="feature-icon">💾</div>
          <h3>Digital Products</h3>
          <p>Download premium templates, designs, and digital assets instantly</p>
          <a routerLink="/products" class="feature-link">Browse Digital →</a>
        </div>
      </section>

      <!-- Newsletter Signup -->
      <section class="newsletter">
        <div class="newsletter-container">
          <div class="newsletter-content">
            <div class="newsletter-icon">📧</div>
            <h2 class="newsletter-title">Stay in the Loop</h2>
            <p class="newsletter-subtitle">
              Subscribe to our newsletter for exclusive offers, design tips, and new product
              launches. Get 10% off your first order!
            </p>
          </div>

          <form
            [formGroup]="newsletterForm"
            (ngSubmit)="onNewsletterSubmit()"
            class="newsletter-form"
          >
            <div class="form-group">
              <input
                type="email"
                formControlName="email"
                placeholder="Enter your email address"
                class="newsletter-input"
                [class.error]="
                  newsletterForm.get('email')?.invalid && newsletterForm.get('email')?.touched
                "
              />
              @if (newsletterForm.get('email')?.invalid && newsletterForm.get('email')?.touched) {
              <span class="error-message">
                @if (newsletterForm.get('email')?.errors?.['required']) { Email is required } @if
                (newsletterForm.get('email')?.errors?.['email']) { Please enter a valid email }
              </span>
              }
            </div>

            <button
              type="submit"
              class="newsletter-button"
              [disabled]="newsletterForm.invalid || isSubmitting()"
            >
              @if (isSubmitting()) {
              <span class="spinner"></span>
              Subscribing... } @else { Subscribe }
            </button>
          </form>

          @if (subscriptionSuccess()) {
          <div class="success-message">
            ✓ Thank you for subscribing! Check your email for your 10% discount code.
          </div>
          } @if (subscriptionError()) {
          <div class="error-banner">✕ {{ subscriptionError() }}</div>
          }

          <p class="newsletter-privacy">
            We respect your privacy. Unsubscribe anytime. No spam, we promise! 🔒
          </p>
        </div>
      </section>

      <section class="stats">
        <div class="stat-item">
          <div class="stat-number">10K+</div>
          <div class="stat-label">Happy Customers</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">50K+</div>
          <div class="stat-label">Orders Completed</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">500+</div>
          <div class="stat-label">Product Options</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">4.9★</div>
          <div class="stat-label">Average Rating</div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        min-height: 100vh;
      }

      .hero {
        text-align: center;
        padding: 6rem 2rem;
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-cyan);
        border-radius: 24px;
        margin-bottom: 4rem;
        box-shadow: 0 4px 16px rgba(0, 217, 255, 0.15), 0 2px 8px rgba(0, 217, 255, 0.08);
        position: relative;
        overflow: hidden;
      }

      .hero::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%);
        pointer-events: none;
        animation: pulse 4s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.5;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.1);
        }
      }

      .hero-title {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
        font-weight: 900;
        font-family: 'Orbitron', sans-serif;
        letter-spacing: -0.02em;
        position: relative;
        z-index: 1;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
      }

      .hero-subtitle {
        font-size: 1.25rem;
        color: var(--text-secondary);
        margin-bottom: 2.5rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        z-index: 1;
      }

      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        position: relative;
        z-index: 1;
      }

      .btn-primary,
      .btn-secondary {
        padding: 1rem 2.5rem;
        border-radius: 9999px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 1.1rem;
        position: relative;
        overflow: hidden;
      }

      .btn-primary {
        background: linear-gradient(135deg, #c92a3e 0%, #a01e2e 100%);
        color: white;
        border: none;
      }

      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
      }

      .btn-primary:hover::before {
        left: 100%;
      }

      .btn-secondary {
        background: transparent;
        color: #c92a3e;
        border: 1px solid #c92a3e;
      }

      .btn-primary:hover {
        transform: translateY(-3px) scale(1.05);
      }

      .btn-secondary:hover {
        background: rgba(201, 42, 62, 0.1);
        transform: translateY(-3px);
      }

      /* Featured Products Carousel */
      .featured-products {
        margin-bottom: 4rem;
      }

      .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, var(--cyan-500) 0%, var(--purple-500) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .section-subtitle {
        text-align: center;
        color: var(--text-secondary);
        font-size: 1.125rem;
        margin-bottom: 3rem;
      }

      .carousel-container {
        position: relative;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 3rem;
      }

      .carousel-track {
        overflow: hidden;
        border-radius: 16px;
      }

      .carousel-inner {
        display: flex;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .product-card {
        min-width: calc(33.333% - 1.333rem);
        margin: 0 0.666rem;
        background: var(--surface-glass);
        border: 1px solid var(--border-cyan);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 217, 255, 0.1);
      }

      .product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 217, 255, 0.2);
        border-color: var(--cyan-400);
      }

      .product-image {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        background: linear-gradient(
          135deg,
          rgba(139, 92, 246, 0.1) 0%,
          rgba(0, 217, 255, 0.1) 100%
        );
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .product-card:hover .product-image img {
        transform: scale(1.1);
      }

      .product-category {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--cyan-500);
        color: var(--bg-primary);
        padding: 0.375rem 0.875rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .product-info {
        padding: 1.5rem;
      }

      .product-name {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      .product-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--cyan-400);
        margin-bottom: 1rem;
      }

      .btn-customize {
        display: block;
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, var(--purple-500) 0%, var(--cyan-500) 100%);
        color: white;
        text-align: center;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .btn-customize:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 217, 255, 0.4);
      }

      .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--surface-glass);
        border: 2px solid var(--border-cyan);
        color: var(--cyan-400);
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .carousel-btn:hover:not(:disabled) {
        background: var(--cyan-500);
        color: var(--bg-primary);
        border-color: var(--cyan-500);
        transform: translateY(-50%) scale(1.1);
      }

      .carousel-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .carousel-btn-prev {
        left: 0;
      }

      .carousel-btn-next {
        right: 0;
      }

      .carousel-indicators {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 2rem;
      }

      .indicator-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--border-cyan);
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
      }

      .indicator-dot:hover {
        background: var(--cyan-400);
        transform: scale(1.2);
      }

      .indicator-dot.active {
        background: var(--cyan-500);
        width: 32px;
        border-radius: 6px;
      }

      /* Category Showcase */
      .categories {
        margin-bottom: 4rem;
      }

      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .category-card {
        background: var(--surface-glass);
        border: 2px solid var(--border-cyan);
        border-radius: 20px;
        padding: 2rem;
        text-decoration: none;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .category-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: -1;
      }

      .category-card[data-color='purple'] {
        --gradient-start: rgba(139, 92, 246, 0.1);
        --gradient-end: rgba(168, 85, 247, 0.05);
      }

      .category-card[data-color='cyan'] {
        --gradient-start: rgba(0, 217, 255, 0.1);
        --gradient-end: rgba(6, 182, 212, 0.05);
      }

      .category-card[data-color='pink'] {
        --gradient-start: rgba(236, 72, 153, 0.1);
        --gradient-end: rgba(219, 39, 119, 0.05);
      }

      .category-card[data-color='blue'] {
        --gradient-start: rgba(59, 130, 246, 0.1);
        --gradient-end: rgba(37, 99, 235, 0.05);
      }

      .category-card[data-color='green'] {
        --gradient-start: rgba(34, 197, 94, 0.1);
        --gradient-end: rgba(22, 163, 74, 0.05);
      }

      .category-card[data-color='orange'] {
        --gradient-start: rgba(249, 115, 22, 0.1);
        --gradient-end: rgba(234, 88, 12, 0.05);
      }

      .category-card:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: var(--cyan-400);
        box-shadow: 0 20px 40px rgba(0, 217, 255, 0.2);
      }

      .category-card:hover::before {
        opacity: 1;
      }

      .category-icon {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: var(--surface-glass);
        border-radius: 16px;
        border: 1px solid var(--border-cyan);
        transition: all 0.3s ease;
      }

      .category-card:hover .category-icon {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 8px 16px rgba(0, 217, 255, 0.3);
      }

      .category-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
        transition: color 0.3s ease;
      }

      .category-card:hover .category-name {
        color: var(--cyan-400);
      }

      .category-description {
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        flex-grow: 1;
      }

      .category-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border-cyan);
      }

      .product-count {
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 600;
      }

      .arrow {
        font-size: 1.5rem;
        color: var(--cyan-400);
        transition: transform 0.3s ease;
      }

      .category-card:hover .arrow {
        transform: translateX(5px);
      }

      /* Testimonials Section */
      .testimonials {
        margin-bottom: 4rem;
        padding: 3rem 0;
      }

      .testimonials-carousel {
        position: relative;
        max-width: 900px;
        margin: 0 auto;
        padding: 0 3rem;
      }

      .testimonials-track {
        overflow: hidden;
        border-radius: 20px;
      }

      .testimonials-inner {
        display: flex;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .testimonial-card {
        min-width: 100%;
        background: var(--surface-glass);
        border: 2px solid var(--border-cyan);
        border-radius: 20px;
        padding: 3rem;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 8px 24px rgba(0, 217, 255, 0.15);
        transition: all 0.3s ease;
      }

      .testimonial-card:hover {
        border-color: var(--cyan-400);
        box-shadow: 0 12px 32px rgba(0, 217, 255, 0.25);
      }

      .testimonial-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid var(--cyan-500);
        object-fit: cover;
        box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
      }

      .testimonial-info {
        flex: 1;
      }

      .testimonial-name {
        font-size: 1.375rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 0.375rem 0;
      }

      .testimonial-role {
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin: 0;
      }

      .rating {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 1.5rem;
      }

      .star {
        font-size: 1.5rem;
        color: var(--border-cyan);
        transition: color 0.3s ease;
      }

      .star.filled {
        color: #fbbf24;
        text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
      }

      .testimonial-text {
        font-size: 1.125rem;
        line-height: 1.8;
        color: var(--text-primary);
        margin-bottom: 1.5rem;
        font-style: italic;
      }

      .testimonial-date {
        font-size: 0.875rem;
        color: var(--text-secondary);
        text-align: right;
      }

      @media (max-width: 768px) {
        .testimonials-carousel {
          padding: 0 2.5rem;
        }

        .testimonial-card {
          padding: 2rem 1.5rem;
        }

        .avatar {
          width: 60px;
          height: 60px;
        }

        .testimonial-name {
          font-size: 1.125rem;
        }

        .testimonial-text {
          font-size: 1rem;
        }
      }

      /* Call-to-Action Sections */
      .cta-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
      }

      .cta-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2.5rem;
        border-radius: 24px;
        position: relative;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
      }

      .cta-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.1;
        z-index: 0;
        transition: opacity 0.4s ease;
      }

      .cta-primary {
        background: linear-gradient(
          135deg,
          rgba(168, 85, 247, 0.15) 0%,
          rgba(139, 92, 246, 0.1) 100%
        );
        border-color: rgba(168, 85, 247, 0.3);
      }

      .cta-primary::before {
        background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.3), transparent);
      }

      .cta-secondary {
        background: linear-gradient(
          135deg,
          rgba(0, 217, 255, 0.15) 0%,
          rgba(6, 182, 212, 0.1) 100%
        );
        border-color: rgba(0, 217, 255, 0.3);
      }

      .cta-secondary::before {
        background: radial-gradient(circle at top left, rgba(0, 217, 255, 0.3), transparent);
      }

      .cta-tertiary {
        background: linear-gradient(
          135deg,
          rgba(236, 72, 153, 0.15) 0%,
          rgba(219, 39, 119, 0.1) 100%
        );
        border-color: rgba(236, 72, 153, 0.3);
      }

      .cta-tertiary::before {
        background: radial-gradient(circle at top left, rgba(236, 72, 153, 0.3), transparent);
      }

      .cta-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 217, 255, 0.2);
      }

      .cta-primary:hover {
        border-color: rgba(168, 85, 247, 0.6);
        box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3);
      }

      .cta-secondary:hover {
        border-color: rgba(0, 217, 255, 0.6);
      }

      .cta-tertiary:hover {
        border-color: rgba(236, 72, 153, 0.6);
        box-shadow: 0 20px 40px rgba(236, 72, 153, 0.3);
      }

      .cta-card:hover::before {
        opacity: 0.2;
      }

      .cta-content {
        flex: 1;
        position: relative;
        z-index: 1;
      }

      .cta-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        display: inline-block;
        animation: bounce 2s infinite;
      }

      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .cta-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
      }

      .cta-description {
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }

      .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.75rem;
        border-radius: 12px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .cta-button-light {
        background: rgba(255, 255, 255, 0.15);
        color: var(--text-primary);
        border: 2px solid rgba(168, 85, 247, 0.5);
        backdrop-filter: blur(10px);
      }

      .cta-button-light:hover {
        background: rgba(168, 85, 247, 0.2);
        border-color: rgba(168, 85, 247, 0.8);
        transform: translateX(5px);
      }

      .cta-button-outline {
        background: transparent;
        color: var(--cyan-400);
        border: 2px solid var(--cyan-400);
      }

      .cta-button-outline:hover {
        background: var(--cyan-400);
        color: var(--bg-primary);
        transform: translateX(5px);
      }

      .cta-button-gradient {
        background: linear-gradient(135deg, var(--purple-500) 0%, var(--pink-500) 100%);
        color: white;
        border: none;
      }

      .cta-button-gradient:hover {
        box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
        transform: translateX(5px);
      }

      .arrow-icon {
        transition: transform 0.3s ease;
      }

      .cta-button:hover .arrow-icon {
        transform: translateX(5px);
      }

      .cta-visual {
        position: relative;
        margin-left: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 100px;
      }

      .cta-badge {
        font-size: 2.5rem;
        font-weight: 900;
        color: var(--purple-400);
        text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        line-height: 1;
      }

      .cta-badge-label {
        font-size: 1rem;
        font-weight: 700;
        color: var(--purple-300);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .cta-percentage {
        font-size: 3.5rem;
        font-weight: 900;
        color: var(--cyan-400);
        text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
        line-height: 1;
      }

      .cta-percentage-label {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--cyan-300);
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .cta-icon-large {
        font-size: 4rem;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
      }

      @media (max-width: 768px) {
        .cta-sections {
          grid-template-columns: 1fr;
        }

        .cta-card {
          flex-direction: column;
          text-align: center;
          padding: 2rem 1.5rem;
        }

        .cta-visual {
          margin-left: 0;
          margin-top: 1.5rem;
        }
      }

      /* Newsletter Section */
      .newsletter {
        margin-bottom: 4rem;
      }

      .newsletter-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 3rem;
        background: linear-gradient(
          135deg,
          rgba(168, 85, 247, 0.1) 0%,
          rgba(0, 217, 255, 0.1) 100%
        );
        border: 2px solid var(--border-cyan);
        border-radius: 24px;
        text-align: center;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }

      .newsletter-container::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .newsletter-content {
        position: relative;
        z-index: 1;
        margin-bottom: 2rem;
      }

      .newsletter-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        animation: bounce 2s infinite;
      }

      .newsletter-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--cyan-400) 0%, var(--purple-400) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .newsletter-subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
      }

      .newsletter-form {
        display: flex;
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto 1.5rem;
        position: relative;
        z-index: 1;
      }

      .form-group {
        flex: 1;
        position: relative;
      }

      .newsletter-input {
        width: 100%;
        padding: 1rem 1.5rem;
        border: 2px solid var(--border-cyan);
        border-radius: 12px;
        background: var(--surface-glass);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .newsletter-input::placeholder {
        color: var(--text-secondary);
      }

      .newsletter-input:focus {
        outline: none;
        border-color: var(--cyan-400);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.2);
      }

      .newsletter-input.error {
        border-color: #ef4444;
      }

      .error-message {
        position: absolute;
        bottom: -1.5rem;
        left: 0;
        color: #ef4444;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .newsletter-button {
        padding: 1rem 2.5rem;
        background: linear-gradient(135deg, var(--purple-500) 0%, var(--cyan-500) 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .newsletter-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 217, 255, 0.4);
      }

      .newsletter-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .success-message {
        background: rgba(34, 197, 94, 0.15);
        border: 2px solid #22c55e;
        color: #22c55e;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        font-weight: 600;
        position: relative;
        z-index: 1;
      }

      .error-banner {
        background: rgba(239, 68, 68, 0.15);
        border: 2px solid #ef4444;
        color: #ef4444;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        font-weight: 600;
        position: relative;
        z-index: 1;
      }

      .newsletter-privacy {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
        position: relative;
        z-index: 1;
      }

      @media (max-width: 768px) {
        .newsletter-container {
          padding: 2rem 1.5rem;
        }

        .newsletter-title {
          font-size: 2rem;
        }

        .newsletter-form {
          flex-direction: column;
        }

        .newsletter-button {
          width: 100%;
          justify-content: center;
        }
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
      }

      .feature-card {
        padding: 2.5rem;
        border-radius: 16px;
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
        box-shadow: var(--shadow-lg);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        transition: height 0.3s;
      }

      .card-purple::before {
        background: linear-gradient(135deg, #00d9ff, #0099ff);
        box-shadow: 0 0 30px rgba(0, 217, 255, 0.5);
      }

      .card-pink::before {
        background: linear-gradient(135deg, #ff3b5c, #ff6b88);
        box-shadow: 0 0 30px rgba(255, 59, 92, 0.5);
      }

      .card-blue::before {
        background: linear-gradient(135deg, #a855f7, #00d9ff);
        box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
      }

      .feature-card:hover {
        transform: translateY(-10px);
        border-color: var(--border-cyan);
        box-shadow: var(--shadow-glow-cyan);
      }

      .feature-card:hover::before {
        height: 6px;
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .feature-card h3 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-weight: 700;
      }

      .feature-card p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.8;
        font-size: 1rem;
      }

      .feature-link {
        color: #00d9ff;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s;
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .feature-link::after {
        content: '';
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #00d9ff, #0099ff);
        position: absolute;
        bottom: -2px;
        left: 0;
        transition: width 0.3s;
      }

      .feature-link:hover {
        color: #0099ff;
        text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
      }

      .feature-link:hover::after {
        width: 100%;
      }

      .stats {
        padding: 3rem 2rem;
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
        border-radius: 24px;
        box-shadow: var(--shadow-lg);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
      }

      .stat-item {
        text-align: center;
        padding: 1rem;
      }

      .stat-number {
        font-size: 3rem;
        font-weight: 900;
        background: linear-gradient(135deg, #00d9ff 0%, #ff3b5c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
        filter: drop-shadow(0 0 20px rgba(0, 217, 255, 0.3));
      }

      .stat-label {
        color: var(--text-secondary);
        font-size: 1rem;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .hero-title {
          font-size: 2rem;
        }

        .hero-subtitle {
          font-size: 1rem;
        }

        .features {
          grid-template-columns: 1fr;
        }

        .stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .product-card {
          min-width: calc(100% - 1rem);
        }

        .carousel-container {
          padding: 0 2.5rem;
        }

        .section-title {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  currentSlide = signal(0);
  currentTestimonial = signal(0);
  isSubmitting = signal(false);
  subscriptionSuccess = signal(false);
  subscriptionError = signal<string | null>(null);

  newsletterForm: FormGroup;

  featuredProducts: FeaturedProduct[] = [
    {
      id: 1,
      name: 'Custom Coffee Mug',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
      category: 'Mugs',
    },
    {
      id: 2,
      name: 'Premium T-Shirt',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'Apparel',
    },
    {
      id: 3,
      name: 'Phone Case',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
      category: 'Accessories',
    },
    {
      id: 4,
      name: 'Canvas Tote Bag',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
      category: 'Bags',
    },
    {
      id: 5,
      name: 'Water Bottle',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
      category: 'Drinkware',
    },
    {
      id: 6,
      name: 'Hoodie',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      category: 'Apparel',
    },
  ];

  categories: ProductCategory[] = [
    {
      id: 'mugs',
      name: 'Mugs & Drinkware',
      icon: '☕',
      description: 'Custom coffee mugs, water bottles, and tumblers with your unique designs',
      productCount: 45,
      color: 'purple',
    },
    {
      id: 'apparel',
      name: 'Apparel',
      icon: '👕',
      description: 'T-shirts, hoodies, hats, and more clothing items for sublimation printing',
      productCount: 120,
      color: 'cyan',
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: '📱',
      description: 'Phone cases, bags, keychains, and other customizable accessories',
      productCount: 85,
      color: 'pink',
    },
    {
      id: 'stationery',
      name: 'Stationery',
      icon: '📄',
      description: 'Business cards, letterheads, flyers, brochures, and marketing materials',
      productCount: 60,
      color: 'blue',
    },
    {
      id: 'home-decor',
      name: 'Home Decor',
      icon: '🏠',
      description: 'Pillows, blankets, wall art, coasters, and decorative items',
      productCount: 75,
      color: 'green',
    },
    {
      id: 'digital',
      name: 'Digital Products',
      icon: '💾',
      description: 'Downloadable templates, designs, mockups, and digital assets',
      productCount: 200,
      color: 'orange',
    },
  ];

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechStart Inc',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'MakeBelieve Imprints transformed our corporate branding! The custom mugs and t-shirts for our team event were absolutely perfect. The quality exceeded our expectations and the design tool was incredibly easy to use.',
      date: 'November 2025',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Small Business Owner',
      company: "Chen's Coffee Shop",
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: "I've ordered hundreds of custom coffee mugs for my shop. The print quality is fantastic, the colors are vibrant, and they hold up great after many washes. My customers love them and always ask where I get them made!",
      date: 'October 2025',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Event Coordinator',
      company: 'Celebration Events',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'We use MakeBelieve Imprints for all our client events. From personalized water bottles to custom tote bags, everything is always delivered on time and looks amazing. Their customer service is top-notch!',
      date: 'December 2025',
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Graphic Designer',
      company: 'Freelance',
      avatar: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      text: "As a designer, I'm very picky about print quality. MakeBelieve Imprints nails it every time. The color accuracy is spot on and the sublimation process produces stunning results. Highly recommend for professionals!",
      date: 'September 2025',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      role: 'Wedding Planner',
      company: 'Perfect Day Weddings',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      text: "I've ordered custom gifts for over 50 weddings through MakeBelieve Imprints. Personalized phone cases, mugs, and hoodies make perfect wedding favors. My couples always rave about the quality!",
      date: 'November 2025',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    // Auto-advance product carousel every 5 seconds
    setInterval(() => {
      if (this.currentSlide() < this.maxSlide()) {
        this.nextSlide();
      } else {
        this.currentSlide.set(0);
      }
    }, 5000);

    // Auto-advance testimonial carousel every 7 seconds
    setInterval(() => {
      if (this.currentTestimonial() < this.testimonials.length - 1) {
        this.nextTestimonial();
      } else {
        this.currentTestimonial.set(0);
      }
    }, 7000);
  }

  maxSlide() {
    // Show 3 products at a time on desktop, calculate max slide
    return Math.max(0, Math.ceil(this.featuredProducts.length / 3) - 1);
  }

  carouselDots() {
    return Array(this.maxSlide() + 1).fill(0);
  }

  nextSlide() {
    if (this.currentSlide() < this.maxSlide()) {
      this.currentSlide.update((val) => val + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update((val) => val - 1);
    }
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  nextTestimonial() {
    if (this.currentTestimonial() < this.testimonials.length - 1) {
      this.currentTestimonial.update((val) => val + 1);
    }
  }

  previousTestimonial() {
    if (this.currentTestimonial() > 0) {
      this.currentTestimonial.update((val) => val - 1);
    }
  }

  goToTestimonial(index: number) {
    this.currentTestimonial.set(index);
  }

  onNewsletterSubmit() {
    if (this.newsletterForm.valid) {
      this.isSubmitting.set(true);
      this.subscriptionError.set(null);

      // Simulate API call
      setTimeout(() => {
        const email = this.newsletterForm.get('email')?.value;
        console.log('Newsletter subscription:', email);

        // Simulate success
        this.isSubmitting.set(false);
        this.subscriptionSuccess.set(true);
        this.newsletterForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.subscriptionSuccess.set(false);
        }, 5000);

        // Uncomment below to simulate error
        // this.subscriptionError.set('Something went wrong. Please try again.');
        // this.isSubmitting.set(false);
      }, 1500);
    }
  }
}
