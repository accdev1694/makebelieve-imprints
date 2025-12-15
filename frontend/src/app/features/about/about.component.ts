import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-page bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About MakeBelieve Imprints
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Bringing your creative visions to life through high-quality custom printing and design
            services
          </p>
        </div>

        <!-- Our Story -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
          <div class="prose dark:prose-invert max-w-none">
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Founded with a passion for creativity and quality, MakeBelieve Imprints has been
              helping individuals and businesses bring their ideas to life through custom printing
              solutions. What started as a small print shop has grown into a full-service design and
              printing company serving customers nationwide.
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
              We specialize in sublimation printing, custom stationery, and digital products that
              help our customers stand out. Whether you're looking for custom mousepads with
              programming cheatsheets, personalized business cards, or unique gifts, we're here to
              make your vision a reality.
            </p>
          </div>
        </div>

        <!-- Values Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quality First</h3>
            <p class="text-gray-600 dark:text-gray-300">
              We use premium materials and state-of-the-art printing technology to ensure every
              product meets our high standards.
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Fast Turnaround
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Quick production times without compromising quality. Most orders ship within 2-3
              business days.
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div
              class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Customer Satisfaction
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Your satisfaction is our priority. We work closely with you to ensure perfect results
              every time.
            </p>
          </div>
        </div>

        <!-- What We Offer -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">What We Offer</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Custom Design Services
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Professional design assistance to bring your ideas to life
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sublimation Printing
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Vibrant, long-lasting prints on a variety of products
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Business Stationery
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Professional business cards, letterheads, and more
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Digital Products
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Downloadable templates and design resources
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white"
        >
          <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p class="text-xl mb-6 opacity-90">
            Browse our products or contact us to discuss your custom project
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/products"
              class="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </a>
            <a
              routerLink="/contact"
              class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .prose {
        max-width: 100%;
      }
    `,
  ],
})
export class AboutComponent {}
