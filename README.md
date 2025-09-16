### Project Overview

Tour Management System Backend API built with Node.js, Express, and TypeScript. It provides authentication, role-based access control, tour and division management, booking and payment via SSLCommerz (sandbox), OTP flows, and analytics-ready endpoints. MongoDB with Mongoose is used for data persistence, and the service is structured with modular routes and strong validation and error handling.

### Key Features

- Authentication with credentials and Google OAuth
- JWT-based access with refresh tokens and secure cookie handling
- Role-based authorization: SUPER_ADMIN, ADMIN, USER, GUIDE
- Tour CRUD with media upload (Multer + Cloudinary)
- Division CRUD and public fetching by slug
- Booking creation with Zod validation
- Payment integration with SSLCommerz (initiate, success, fail, cancel, re-pay, validate)
- OTP send/verify endpoints (Redis-backed)
- Centralized error handling and Zod schema validation

### Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, Passport (Google OAuth) |
| Upload/Storage | Multer, Cloudinary |
| Validation | Zod |
| Caching/OTP | Redis |
| Email/PDF | Nodemailer, EJS templates, PDFKit |
| Linting | ESLint |

### Authentication

- POST `/api/v1/auth/login`: Email/password login, returns tokens
- POST `/api/v1/auth/refresh-token`: Issues new access token using refresh token
- GET `/api/v1/auth/logout`: Clears tokens
- POST `/api/v1/auth/change-password` (auth required): Change current user password
- POST `/api/v1/auth/set-password` (auth required): Set password (e.g., after OAuth)
- POST `/api/v1/auth/forget-password`: Send password reset email with redirect token
- POST `/api/v1/auth/reset-password` (auth required): Reset password using token
- GET `/api/v1/auth/google`: Start Google OAuth
- GET `/api/v1/auth/google/callback`: Google OAuth callback

### Role-Based API Endpoints

Note: All routes are prefixed with `/api/v1`.

- User
  - GET `/user/all-user` (ADMIN, SUPER_ADMIN): List all users
  - GET `/user/me` (Any role): Get current user profile
  - POST `/user/register` (Public): Register a new user
  - PATCH `/user/:id` (ADMIN, SUPER_ADMIN, USER): Update a user

- Division
  - POST `/division/create` (ADMIN, SUPER_ADMIN): Create a division
  - GET `/division/` (Public): List divisions
  - GET `/division/:slug` (Public): Get division by slug
  - PATCH `/division/:id` (ADMIN, SUPER_ADMIN): Update a division
  - DELETE `/division/:id` (ADMIN, SUPER_ADMIN): Delete a division

- Tour
  - POST `/tour/create-tour-type` (ADMIN, SUPER_ADMIN): Create tour type
  - GET `/tour/tour-types` (Public): List tour types
  - PATCH `/tour/tour-types/:id` (ADMIN, SUPER_ADMIN): Update tour type
  - DELETE `/tour/tour-types/:id` (ADMIN, SUPER_ADMIN): Delete tour type
  - POST `/tour/create` (ADMIN, SUPER_ADMIN): Create a tour with media upload
  - GET `/tour/` (Public): List tours with filters
  - PATCH `/tour/:id` (ADMIN, SUPER_ADMIN): Update a tour

- Booking
  - POST `/booking/` (Any role): Create a booking

- Payment (SSLCommerz)
  - POST `/payment/success` (SSLCommerz callback): Handle success and redirect
  - POST `/payment/fail` (SSLCommerz callback): Handle failure and redirect
  - POST `/payment/cancel` (SSLCommerz callback): Handle cancel and redirect
  - POST `/payment/rePay/:bookingId` (User): Retry payment for a booking
  - POST `/payment/validate-payment` (SSLCommerz IPN): Validate payment data and persist

- OTP
  - POST `/otp/send` (Public): Send OTP to email/phone
  - POST `/otp/verify` (Public): Verify OTP code

### How to Run

Prerequisites: Node.js, MongoDB, Redis, Cloudinary creds, SSLCommerz sandbox creds.

1) Install dependencies
```
npm install
```

2) Configure environment variables (see `src/app/config/env.ts` for required keys). Create `.env` with at least:
```
PORT=5000
MONGO_URI=<your_mongodb_uri>
NODE_ENV=development
JWT_ACCESS_SECRET=<secret>
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=<secret>
JWT_REFRESH_EXPIRES=7d
EXPRESS_SESSION=<session_secret>

SSL_STORE_ID=<sandbox_store_id>
SSL_STORE_PASS=<sandbox_store_pass>
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v3/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SSL_SUCCESS_BACKEND_URL=<your_backend_base_url>/api/v1/payment/success
SSL_FAIL_BACKEND_URL=<your_backend_base_url>/api/v1/payment/fail
SSL_CANCEL_BACKEND_URL=<your_backend_base_url>/api/v1/payment/cancel
SSL_SUCCESS_FRONTEND_URL=<your_frontend_success_url>
SSL_FAIL_FRONTEND_URL=<your_frontend_fail_url>
SSL_CANCEL_FRONTEND_URL=<your_frontend_cancel_url>
SSL_IPN_URL=<your_backend_base_url>/api/v1/payment/validate-payment

CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
```

3) Run in development (TypeScript with ts-node-dev)
```
npm run server
```

4) Build and run in production
```
npm run build
npm start
```

5) Base URL

The API is mounted under `/api/v1`. Example: `GET http://localhost:5000/api/v1/tour`.


