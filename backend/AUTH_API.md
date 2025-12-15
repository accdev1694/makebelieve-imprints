# Authentication API Documentation

## Overview

Complete authentication system with JWT tokens, password reset, and email verification.

## Endpoints

### Public Endpoints

#### 1. Register User

```
POST /api/auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isEmailVerified": false,
      "isActive": true
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

**Validation:**

- Email: Valid email format, required
- Password: Minimum 6 characters, required
- First/Last Name: Required, trimmed

---

#### 2. Login User

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "lastLogin": "2025-12-15T10:30:00Z"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

**Error Responses:**

- 401: Invalid email or password
- 403: Account is deactivated

---

#### 3. Refresh Access Token

```
POST /api/auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-jwt-access-token"
  }
}
```

---

#### 4. Forgot Password

```
POST /api/auth/forgot-password
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "If the email exists, a reset link will be sent",
  "data": {}
}
```

**Note:** Returns same response whether email exists or not (security best practice)

---

#### 5. Reset Password

```
POST /api/auth/reset-password
```

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {}
}
```

**Error Responses:**

- 400: Invalid or expired reset token
- 400: Password validation failed

---

#### 6. Verify Email

```
POST /api/auth/verify-email
```

**Request Body:**

```json
{
  "token": "verification-token-from-email"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {}
}
```

---

### Protected Endpoints

#### 7. Get User Profile

```
GET /api/auth/profile
```

**Headers:**

```
Authorization: Bearer {access-token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "isEmailVerified": true,
      "isActive": true,
      "lastLogin": "2025-12-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**

- 401: No authentication token provided
- 401: Invalid or expired token

---

## JWT Token Details

### Access Token

- **Purpose:** Short-lived token for API authentication
- **Expiration:** 7 days
- **Payload:**

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "customer"
}
```

### Refresh Token

- **Purpose:** Long-lived token to get new access tokens
- **Expiration:** 30 days
- **Payload:**

```json
{
  "userId": "uuid"
}
```

---

## Middleware

### 1. authenticate

Verifies JWT access token and attaches user data to `req.user`.

**Usage:**

```javascript
router.get('/protected-route', authenticate, controller)
```

### 2. authorize(...roles)

Checks if authenticated user has required role.

**Usage:**

```javascript
router.delete('/admin-only', authenticate, authorize('admin'), controller)
```

### 3. optionalAuth

Attaches user data if token exists, but doesn't fail if missing.

**Usage:**

```javascript
router.get('/public-or-private', optionalAuth, controller)
```

---

## Security Features

1. **Password Hashing:** bcrypt with automatic salting (10 rounds)
2. **JWT Signing:** Secret key from environment variables
3. **Token Expiration:** Short-lived access tokens, long-lived refresh tokens
4. **Crypto Tokens:** Email verification and password reset use 32-byte random tokens
5. **Token Hashing:** Reset/verification tokens hashed before storage
6. **Role-Based Access:** Admin vs customer authorization
7. **Account Deactivation:** Inactive accounts cannot login
8. **Rate Limiting:** API-wide rate limiting configured

---

## Environment Variables Required

```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=30d
```

---

## Testing the API

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get Profile (with token)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Next Steps

1. **Set up PostgreSQL database** for testing
2. **Configure email service** for verification and password reset emails
3. **Add email templates** for prettier emails
4. **Implement token blacklist** for logout (optional)
5. **Add OAuth providers** (Google, Facebook) for social login
6. **Set up rate limiting** per user/endpoint
7. **Add 2FA support** for enhanced security

---

## Files Created

- `backend/controllers/auth.controller.js` - All authentication logic
- `backend/middleware/auth.middleware.js` - JWT verification and authorization
- `backend/middleware/validate.middleware.js` - Request validation handler
- `backend/routes/auth.routes.js` - Authentication routes with validation
- `backend/utils/jwt.js` - JWT token utilities
- `backend/utils/helpers.js` - Helper functions for responses, validation, etc.

---

## Database Schema Used

**User Model Fields:**

- id (UUID, PK)
- email (unique, lowercase)
- password (hashed)
- firstName, lastName
- role (customer/admin)
- isEmailVerified
- isActive
- emailVerificationToken (hashed)
- passwordResetToken (hashed)
- passwordResetExpires
- lastLogin
- createdAt, updatedAt

---

## Common Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**Status Codes:**

- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication failed)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error
