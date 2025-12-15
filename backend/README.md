# MakeBelieve Imprints Backend API

Backend server for the MakeBelieve Imprints ecommerce platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
backend/
├── config/
│   └── database.js       # Database configuration
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   └── product.controller.js
├── middleware/          # Custom middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── upload.middleware.js
├── models/             # Database models
│   └── index.js
├── routes/             # API routes
│   ├── auth.routes.js
│   └── product.routes.js
├── utils/              # Helper functions
│   └── helpers.js
├── uploads/            # File uploads directory
├── .env                # Environment variables (not in git)
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
├── index.js            # Main server file
└── package.json        # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from template:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

   - Database credentials
   - JWT secret keys
   - Email configuration
   - Stripe API keys

4. Set up PostgreSQL database:

```bash
# Create database
createdb makebelieve_imprints

# Or using psql
psql -U postgres
CREATE DATABASE makebelieve_imprints;
```

### Running the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Authentication (Coming in Phase 2.2)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address

### Products (Coming in Phase 2.3)

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

## Environment Variables

See `.env.example` for all required environment variables.

## Security Features

- Helmet.js for HTTP headers security
- Rate limiting to prevent abuse
- CORS configuration
- JWT authentication
- Bcrypt password hashing
- Input validation with express-validator

## Development

To add new features:

1. Create model in `models/`
2. Create controller in `controllers/`
3. Define routes in `routes/`
4. Add middleware if needed in `middleware/`
5. Update this README

## Testing

```bash
npm test
```

## License

ISC
