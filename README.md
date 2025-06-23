# E-Commerce Application

A full-stack e-commerce application built with Next.js, Express.js, and MongoDB.

## Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy the example environment file:
```bash
cp env.example .env
```

- Configure the following variables in .env:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Create a .env.local file in the frontend directory
- Add the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Technology Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Zustand for state management
- React Query
- React Hook Form

### Backend
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Basic Features

### User Features
- User authentication (login/register)
- Product browsing and search
- Shopping cart management
- Order placement and tracking
- Profile management

### Admin Features
- Product management (CRUD operations)
- User management
- Order management
- Basic analytics dashboard

## Security Features
- JWT authentication
- Password hashing
- Input validation
- Protected routes
- Role-based access control
