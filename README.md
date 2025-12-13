# MakeBelieve Imprints - Ecommerce Printing Business Platform

A comprehensive full-stack ecommerce platform for printing and sublimation business.

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/               # Shared components, pipes, directives
│   │   └── components/
│   ├── features/             # Feature modules
│   │   ├── home/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   └── admin/
│   ├── layouts/              # Layout components
│   ├── app.routes.ts        # Main routing config
│   └── app.component.ts     # Root component
├── assets/                   # Static assets
├── environments/             # Environment configs
├── styles.scss              # Global styles
├── index.html              # HTML entry point
└── main.ts                 # Bootstrap file
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file with backend API URL:

```
NG_APP_API_URL=http://localhost:3000/api
```

3. Start development server:

```bash
npm start
```

The app will be available at `http://localhost:4200`

## Development

### Running the app

```bash
npm start
```

### Running tests

```bash
npm test
```

### Building for production

```bash
npm run build:prod
```

## Architecture

### Core Module

- **AuthService**: Handles authentication and user management
- **authInterceptor**: Injects JWT tokens into API requests
- **errorInterceptor**: Global error handling
- **authGuard**: Route protection for authenticated users

### Features

Each feature module is lazy-loaded and contains:

- Pages (routable components)
- Services (API communication)
- Components (UI components)
- Models (TypeScript interfaces)

## Technologies Used

- **Framework**: Angular 18+
- **State Management**: NgRx
- **Styling**: SCSS + TailwindCSS
- **HTTP**: Angular HttpClient
- **Forms**: Reactive Forms
- **API Communication**: HttpClient with Interceptors
- **Design Editor**: Fabric.js (for customization)

## API Endpoints

The application expects backend API at `http://localhost:3000/api`

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email
- `POST /auth/refresh` - Refresh access token

### Products (Coming Soon)

- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `GET /products/search` - Search products
- `GET /categories` - Get product categories

## Next Steps

1. **Phase 1**: Complete authentication system
2. **Phase 2**: Implement product catalog and filtering
3. **Phase 3**: Build shopping cart functionality
4. **Phase 4**: Integrate Stripe payment processing
5. **Phase 5**: Create design customization canvas

## Contributing

Guidelines for contributing:

- Create feature branches from `develop`
- Follow Angular style guide
- Write unit tests for new features
- Submit PRs with clear descriptions

## License

Proprietary - PrintHub

## Contact

For more information, visit [REQUIREMENTS.md](../REQUIREMENTS.md) and [PROGRESS.md](../PROGRESS.md)
