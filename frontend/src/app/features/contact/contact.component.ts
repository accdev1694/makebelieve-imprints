import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-page bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a question or want to discuss a custom project? We'd love to hear from you!
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Contact Information -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>

              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">Phone</h3>
                    <p class="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">Email</h3>
                    <p class="text-gray-600 dark:text-gray-300">info&#64;makebelieveimprints.com</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">Address</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                      123 Print Street<br />
                      Design City, DC 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-5 h-5 text-orange-600 dark:text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">Business Hours</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9AM - 6PM<br />
                      Saturday: 10AM - 4PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
              <div class="flex gap-3">
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <span class="text-xl">📘</span>
                </a>
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors"
                >
                  <span class="text-xl">🐦</span>
                </a>
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <span class="text-xl">📷</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>

              <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      [(ngModel)]="formData.name"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      [(ngModel)]="formData.email"
                      required
                      email
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    [(ngModel)]="formData.phone"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    for="subject"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    [(ngModel)]="formData.subject"
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label
                    for="message"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    [(ngModel)]="formData.message"
                    required
                    rows="6"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Tell us about your project or question..."
                  ></textarea>
                </div>

                @if (submitSuccess) {
                <div
                  class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <p class="text-green-600 dark:text-green-400">
                    ✓ Thank you! Your message has been sent successfully. We'll get back to you
                    soon.
                  </p>
                </div>
                } @if (submitError) {
                <div
                  class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p class="text-red-600 dark:text-red-400">✗ {{ submitError }}</p>
                </div>
                }

                <button
                  type="submit"
                  [disabled]="!contactForm.valid || submitting"
                  class="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  @if (!submitting) {
                  <span>Send Message</span>
                  } @if (submitting) {
                  <span>Sending...</span>
                  } @if (!submitting) {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  submitting = false;
  submitSuccess = false;
  submitError = '';

  onSubmit(): void {
    if (this.submitting) return;

    this.submitting = true;
    this.submitSuccess = false;
    this.submitError = '';

    // Simulate form submission
    setTimeout(() => {
      this.submitting = false;
      this.submitSuccess = true;

      // Reset form
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      };

      // Clear success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 1000);
  }
}
