import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="account-container">
      <div class="account-header">
        <h1>My Account</h1>
        <p>Manage your profile information and preferences</p>
      </div>

      <div class="account-content">
        <!-- Profile Information Section -->
        <div class="account-section">
          <div class="section-header">
            <h2>Profile Information</h2>
            <button
              type="button"
              class="btn-edit"
              (click)="editingProfile = !editingProfile"
              *ngIf="!editingProfile"
            >
              Edit
            </button>
          </div>

          <form (ngSubmit)="saveProfile()" #profileForm="ngForm" *ngIf="editingProfile">
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="profileData.firstName"
                  required
                  #firstNameInput="ngModel"
                />
                <span class="error" *ngIf="firstNameInput.invalid && firstNameInput.touched">
                  First name is required
                </span>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="profileData.lastName"
                  required
                  #lastNameInput="ngModel"
                />
                <span class="error" *ngIf="lastNameInput.invalid && lastNameInput.touched">
                  Last name is required
                </span>
              </div>

              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="profileData.email"
                  required
                  email
                  #emailInput="ngModel"
                />
                <span class="error" *ngIf="emailInput.invalid && emailInput.touched">
                  Valid email is required
                </span>
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [(ngModel)]="profileData.phone"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div class="form-group">
                <label for="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  [(ngModel)]="profileData.address"
                  placeholder="Street address"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="cancelProfileEdit()">
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="profileForm.invalid || isSaving"
              >
                <span *ngIf="!isSaving">Save Changes</span>
                <span *ngIf="isSaving">Saving...</span>
              </button>
            </div>

            <div class="success-message" *ngIf="profileSuccess">Profile updated successfully!</div>
            <div class="error-message" *ngIf="profileError">{{ profileError }}</div>
          </form>

          <div class="profile-view" *ngIf="!editingProfile">
            <div class="info-grid">
              <div class="info-item">
                <label>Full Name</label>
                <p>{{ profileData.firstName + ' ' + profileData.lastName || 'Not set' }}</p>
              </div>
              <div class="info-item">
                <label>Email Address</label>
                <p>{{ profileData.email }}</p>
              </div>
              <div class="info-item">
                <label>Phone Number</label>
                <p>{{ profileData.phone || 'Not set' }}</p>
              </div>
              <div class="info-item">
                <label>Address</label>
                <p>{{ profileData.address || 'Not set' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Password Change Section -->
        <div class="account-section">
          <div class="section-header">
            <h2>Change Password</h2>
            <button
              type="button"
              class="btn-edit"
              (click)="editingPassword = !editingPassword"
              *ngIf="!editingPassword"
            >
              Change
            </button>
          </div>

          <form (ngSubmit)="changePassword()" #passwordForm="ngForm" *ngIf="editingPassword">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <div class="password-input-wrapper">
                <input
                  [type]="showCurrentPassword ? 'text' : 'password'"
                  id="currentPassword"
                  name="currentPassword"
                  [(ngModel)]="passwordData.currentPassword"
                  required
                  minlength="6"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="showCurrentPassword = !showCurrentPassword"
                >
                  <svg
                    *ngIf="!showCurrentPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg
                    *ngIf="showCurrentPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <div class="password-input-wrapper">
                <input
                  [type]="showNewPassword ? 'text' : 'password'"
                  id="newPassword"
                  name="newPassword"
                  [(ngModel)]="passwordData.newPassword"
                  required
                  minlength="6"
                  #newPasswordInput="ngModel"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="showNewPassword = !showNewPassword"
                >
                  <svg
                    *ngIf="!showNewPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg
                    *ngIf="showNewPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
              <span class="error" *ngIf="newPasswordInput.invalid && newPasswordInput.touched">
                Password must be at least 6 characters
              </span>
            </div>

            <div class="form-group">
              <label for="confirmNewPassword">Confirm New Password</label>
              <div class="password-input-wrapper">
                <input
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  [(ngModel)]="passwordData.confirmPassword"
                  required
                  minlength="6"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="showConfirmPassword = !showConfirmPassword"
                >
                  <svg
                    *ngIf="!showConfirmPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg
                    *ngIf="showConfirmPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    ></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
              <span class="error" *ngIf="!passwordsMatch() && passwordData.confirmPassword">
                Passwords do not match
              </span>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="cancelPasswordEdit()">
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="passwordForm.invalid || !passwordsMatch() || isSaving"
              >
                <span *ngIf="!isSaving">Update Password</span>
                <span *ngIf="isSaving">Updating...</span>
              </button>
            </div>

            <div class="success-message" *ngIf="passwordSuccess">
              Password updated successfully!
            </div>
            <div class="error-message" *ngIf="passwordError">{{ passwordError }}</div>
          </form>

          <div class="password-view" *ngIf="!editingPassword">
            <p class="security-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Your password is secure. Last changed: Never
            </p>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="account-section">
          <div class="section-header">
            <h2>Preferences</h2>
          </div>

          <div class="preferences-list">
            <div class="preference-item">
              <div class="preference-info">
                <h3>Email Notifications</h3>
                <p>Receive updates about your orders and promotions</p>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  [(ngModel)]="preferences.emailNotifications"
                  (change)="savePreferences()"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>SMS Notifications</h3>
                <p>Get text messages about order status</p>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  [(ngModel)]="preferences.smsNotifications"
                  (change)="savePreferences()"
                />
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <h3>Marketing Emails</h3>
                <p>Receive promotional offers and newsletters</p>
              </div>
              <label class="switch">
                <input
                  type="checkbox"
                  [(ngModel)]="preferences.marketingEmails"
                  (change)="savePreferences()"
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="success-message" *ngIf="preferencesSuccess">
            Preferences updated successfully!
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .account-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
      }

      .account-header {
        margin-bottom: 3rem;
      }

      .account-header h1 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
        font-size: 2.5rem;
        font-weight: 700;
      }

      .account-header p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 1.1rem;
      }

      .account-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .account-section {
        background: var(--surface-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-lg);
        padding: 2rem;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-secondary);
      }

      .section-header h2 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 600;
      }

      .btn-edit {
        padding: 0.5rem 1.25rem;
        background: transparent;
        color: var(--primary-cyan);
        border: 1px solid var(--primary-cyan);
        border-radius: var(--radius-md);
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .btn-edit:hover {
        background: rgba(0, 217, 255, 0.1);
        transform: translateY(-1px);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      label {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 0.95rem;
      }

      input[type='text'],
      input[type='email'],
      input[type='tel'],
      input[type='password'] {
        padding: 0.875rem 1rem;
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        font-size: 1rem;
        background: #ffffff;
        color: #1a1a1a;
        transition: all var(--transition-base);
      }

      input:focus {
        outline: none;
        border-color: var(--primary-cyan);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
      }

      .password-input-wrapper {
        position: relative;
      }

      .password-toggle {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        color: var(--text-secondary);
        transition: color var(--transition-fast);
        display: flex;
        align-items: center;
      }

      .password-toggle:hover {
        color: var(--primary-cyan);
      }

      .password-toggle svg {
        width: 20px;
        height: 20px;
        stroke-width: 2;
      }

      .error {
        color: var(--secondary-red);
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      .btn-primary,
      .btn-secondary {
        padding: 0.875rem 1.75rem;
        border-radius: var(--radius-md);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
        color: white;
        border: none;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        opacity: 0.9;
      }

      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-secondary {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-primary);
      }

      .btn-secondary:hover {
        background: var(--surface-hover);
      }

      .success-message {
        margin-top: 1rem;
        padding: 0.875rem;
        background: rgba(0, 217, 255, 0.1);
        border: 1px solid var(--primary-cyan);
        border-radius: var(--radius-md);
        color: var(--primary-cyan);
        font-size: 0.95rem;
        text-align: center;
      }

      .error-message {
        margin-top: 1rem;
        padding: 0.875rem;
        background: rgba(255, 59, 92, 0.1);
        border: 1px solid var(--secondary-red);
        border-radius: var(--radius-md);
        color: var(--secondary-red);
        font-size: 0.95rem;
        text-align: center;
      }

      .profile-view,
      .password-view {
        padding-top: 1rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .info-item label {
        display: block;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .info-item p {
        margin: 0;
        color: var(--text-primary);
        font-size: 1rem;
      }

      .security-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-secondary);
        margin: 0;
      }

      .security-info svg {
        width: 24px;
        height: 24px;
        color: var(--primary-cyan);
        stroke-width: 2;
      }

      .preferences-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .preference-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem;
        background: var(--surface);
        border: 1px solid var(--border-secondary);
        border-radius: var(--radius-md);
      }

      .preference-info h3 {
        margin: 0 0 0.25rem 0;
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 600;
      }

      .preference-info p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 28px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--border-primary);
        transition: 0.3s;
        border-radius: 28px;
      }

      .slider:before {
        position: absolute;
        content: '';
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background: linear-gradient(135deg, var(--primary-cyan), var(--primary-blue));
      }

      input:checked + .slider:before {
        transform: translateX(24px);
      }

      @media (max-width: 768px) {
        .account-container {
          padding: 1.5rem;
        }

        .form-grid,
        .info-grid {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
        }

        .preference-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
      }
    `,
  ],
})
export class AccountComponent implements OnInit {
  private authService = inject(AuthService);

  editingProfile = false;
  editingPassword = false;
  isSaving = false;

  profileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  };

  originalProfileData = { ...this.profileData };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  preferences = {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  profileSuccess = false;
  profileError = '';
  passwordSuccess = false;
  passwordError = '';
  preferencesSuccess = false;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.authService.user();
    if (user) {
      this.profileData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        address: '',
      };
      this.originalProfileData = { ...this.profileData };
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    this.profileSuccess = false;
    this.profileError = '';

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.profileSuccess = true;
      this.editingProfile = false;
      this.originalProfileData = { ...this.profileData };

      setTimeout(() => {
        this.profileSuccess = false;
      }, 3000);
    }, 1000);
  }

  cancelProfileEdit(): void {
    this.profileData = { ...this.originalProfileData };
    this.editingProfile = false;
    this.profileError = '';
  }

  passwordsMatch(): boolean {
    return this.passwordData.newPassword === this.passwordData.confirmPassword;
  }

  changePassword(): void {
    if (!this.passwordsMatch()) {
      this.passwordError = 'Passwords do not match';
      return;
    }

    this.isSaving = true;
    this.passwordSuccess = false;
    this.passwordError = '';

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.passwordSuccess = true;
      this.editingPassword = false;
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };

      setTimeout(() => {
        this.passwordSuccess = false;
      }, 3000);
    }, 1000);
  }

  cancelPasswordEdit(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.editingPassword = false;
    this.passwordError = '';
  }

  savePreferences(): void {
    this.preferencesSuccess = true;

    setTimeout(() => {
      this.preferencesSuccess = false;
    }, 2000);
  }
}
