# FixItNow Backend API

## Overview

FixItNow is a backend API for a home service marketplace where customers
can book technicians, technicians manage jobs, and payments are
processed with Stripe.

## Tech Stack

-   Node.js
-   Express.js
-   TypeScript
-   Prisma ORM
-   PostgreSQL
-   JWT Authentication
-   Stripe
-   Zod

## Features

### Authentication

-   Register
-   Login
-   Refresh Token
-   Role-based Authorization

### Customer

-   Book services
-   Make Stripe payments
-   View payment history
-   Submit reviews

### Technician

-   Create profile
-   Manage services
-   Manage availability
-   Accept/decline bookings

### Admin

-   Manage users
-   Manage categories
-   Delete reviews

## Main API Routes

### Auth

-   POST `/api/auth/login`
-   POST `/api/auth/refresh-token`

### Users

-   GET `/api/users/me`
-   PATCH `/api/users/me`

### Categories

-   CRUD `/api/categories`

### Services

-   CRUD `/api/services`

### Availability

-   CRUD `/api/availability`

### Bookings

-   POST `/api/bookings`
-   GET `/api/bookings/customer`
-   GET `/api/bookings/technician`
-   PATCH `/api/bookings/:id/status`

### Payments

-   POST `/api/payments/create`
-   POST `/api/payments/checkout`
-   POST `/api/payments/webhook`
-   GET `/api/payments/my`
-   GET `/api/payments/:id`

### Reviews

-   POST `/api/reviews`
-   GET `/api/reviews/technician/:technicianId`
-   DELETE `/api/reviews/:id`

## Installation

``` bash
git clone <repository-url>
cd FixItNow-Backend
npm install
```

Create a `.env` file:

``` env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
APP_URL=http://localhost:3000
PORT=5000
```

Run:

``` bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Stripe Webhook

Run:

``` bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Test Card

-   Number: 4242 4242 4242 4242
-   Expiry: Any future date
-   CVC: Any 3 digits

## License

Educational project.
