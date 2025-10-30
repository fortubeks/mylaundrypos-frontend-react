# Laundry POS - React Frontend

A React frontend application for Laundry POS system with Material-UI and Bootstrap.

## Features

- **Static Landing Page**: Landing page served as static HTML
- **React Authentication**: Sign In and Sign Up pages built with React and Material-UI
- **Protected Routes**: Dashboard accessible only after authentication
- **Material-UI**: Modern Material Design components
- **Bootstrap**: For responsive grid and utility classes
- **Redux**: State management with Redux Toolkit for authentication
- **TypeScript**: Type-safe development

## Project Structure

```
mylaundrypos-frontend-react/
├── public/
│   └── landing.html      # Static landing page
├── src/
│   ├── components/       # React components
│   │   ├── ProtectedRoute.tsx  # Route protection for authenticated users
│   │   └── PublicRoute.tsx     # Route protection for public pages
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx    # Main dashboard (protected)
│   │   ├── SignIn.tsx       # Sign in page (public)
│   │   └── SignUp.tsx       # Sign up page (public)
│   ├── services/        # API services
│   │   └── api.ts          # API client with authentication
│   ├── store/           # Redux store configuration
│   │   ├── slices/      # Redux slices
│   │   │   └── authSlice.ts  # Authentication state management
│   │   ├── hooks.ts     # Typed Redux hooks
│   │   └── store.ts     # Redux store configuration
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main App component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # React app HTML entry
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## How It Works

1. **Landing Page**: Users start at `/landing.html` (static HTML)
2. **Authentication**: Users navigate to `/signin` or `/signup` (React pages)
3. **Login/Register**: Forms submit to Laravel backend API
4. **State Management**: Redux stores authentication state
5. **Protected Routes**: Authenticated users access dashboard at `/`
6. **Public Routes**: Unauthenticated users redirected to signin

## API Integration

The app communicates with Laravel backend:
- **Login**: `POST /login` - Authenticates user
- **Register**: `POST /register` - Creates new user account
- **Logout**: `POST /logout` - Ends session

API endpoints are configured in `src/services/api.ts`

## Environment Variables

Create a `.env` file in the root directory with the following:

```
VITE_API_URL=http://localhost:8000/api
```

This will configure the frontend to communicate with your Laravel backend API at `http://localhost:8000/api`.

Note: Make sure your Laravel backend is running on the specified port (default: 8000) and that CORS is properly configured to allow requests from your frontend origin.

