# Environment Configuration

This project uses Angular's environment configuration system to manage different settings for development, staging, and production environments.

## Available Environments

### Development (default)

- **File**: `environment.development.ts`
- **API URL**: `http://localhost:3000/api`
- **Features**: Debug tools enabled, detailed logging
- **Usage**: `npm start` or `ng serve`

### Staging

- **File**: `environment.staging.ts`
- **API URL**: `https://staging-api.makebelieve-imprints.com/api`
- **Features**: Analytics enabled, moderate logging
- **Usage**: `ng serve --configuration=staging` or `ng build --configuration=staging`

### Production

- **File**: `environment.production.ts`
- **API URL**: `https://api.makebelieve-imprints.com/api`
- **Features**: Full optimization, error-only logging, offline mode
- **Usage**: `ng build --configuration=production`

## Environment Structure

Each environment file exports an object with the following properties:

```typescript
{
  production: boolean; // Whether this is a production build
  apiUrl: string; // Backend API base URL
  appName: string; // Application display name
  version: string; // Application version
  enableDebugTools: boolean; // Enable Angular debug tools
  logLevel: string; // Logging level (debug, info, warn, error)
  features: {
    enableAnalytics: boolean; // Enable analytics tracking
    enableNotifications: boolean; // Enable push notifications
    enableOfflineMode: boolean; // Enable offline capabilities
  }
}
```

## Using Environment Variables in Code

Import the environment object in your services or components:

```typescript
import { environment } from '../environments/environment';

// Use in your code
const apiUrl = environment.apiUrl;
const isProduction = environment.production;
```

## Adding New Environment Variables

1. Add the variable to all environment files (`environment.ts`, `environment.development.ts`, `environment.staging.ts`, `environment.production.ts`)
2. Update the TypeScript interface if using type checking
3. Use the variable in your application code

## Important Notes

- Never commit sensitive credentials to environment files
- The `environment.ts` file is used as the default and gets replaced during build
- Use `.env` files for local overrides (not tracked in Git)
