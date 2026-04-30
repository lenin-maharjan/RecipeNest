# RecipeNest

A full-stack recipe sharing application that allows users to discover, create, and share recipes. Features include user authentication, recipe management, bookmarks, reviews, and a chef dashboard with analytics.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure Details](#project-structure-details)
- [Contributing](#contributing)

## Features

- **User Authentication**: Secure JWT-based authentication with login/register
- **Recipe Management**: Create, edit, delete, and view recipes
- **Bookmarks**: Save favorite recipes for later
- **Reviews & Ratings**: Leave reviews and rate recipes with star ratings
- **Chef Dashboard**: Analytics and management tools for content creators
- **Chef Profiles**: View public chef profiles and their recipes
- **Admin Panel**: Manage users, recipes, and platform content
- **Image Upload**: Cloudinary integration for recipe images
- **Role-Based Access Control**: Different permissions for users, chefs, and admins
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Cloudinary** - Image hosting and upload
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin requests
- **Rate Limiting** - Request throttling

## Project Structure

```
RecipeNest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API endpoints
│   │   ├── components/    # React components
│   │   ├── context/       # React context (AuthContext)
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Express backend
    ├── src/
    │   ├── api/          # API endpoints
    │   ├── config/       # Database and Cloudinary config
    │   ├── controllers/  # Business logic
    │   ├── middleware/   # Auth, validation, upload
    │   ├── models/       # MongoDB schemas
    │   ├── routes/       # API routes
    │   ├── utils/        # Helper utilities
    │   ├── app.js
    │   └── server.js
    ├── package.json
    └── .env              # Environment variables
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/users/register/free) for free

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RecipeNest
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## Configuration

### Server Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/recipenest
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/recipenest?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**How to get Cloudinary credentials:**
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret

**How to generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Client Configuration

Create a `.env.local` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Option 1: Run Both Servers Simultaneously

#### Terminal 1 - Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

#### Terminal 2 - Start the Frontend Dev Server

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173` (or another port if 5173 is in use)

### Option 2: Production Build

#### Build the Frontend

```bash
cd client
npm run build
```

This creates an optimized build in `client/dist/`

#### Start the Backend

```bash
cd server
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user info

### Users (`/api/users`)
- `GET /:id` - Get user profile
- `PUT /:id` - Update profile
- `GET /` - Get all chefs
- `DELETE /:id` - Delete account

### Recipes (`/api/recipes`)
- `GET /` - Get all recipes (with filters)
- `GET /:id` - Get recipe details
- `POST /` - Create recipe
- `PUT /:id` - Update recipe
- `DELETE /:id` - Delete recipe

### Bookmarks (`/api/bookmarks`)
- `GET /` - Get bookmarked recipes
- `POST /:recipeId` - Bookmark a recipe
- `DELETE /:recipeId` - Remove bookmark

### Reviews (`/api/reviews`)
- `POST /` - Create review
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

### Admin (`/api/admin`)
- `GET /stats` - Get platform statistics
- `GET /users` - Get all users (admin only)
- `GET /recipes` - Get all recipes (admin only)
- `DELETE /users/:id` - Delete user (admin only)

## Project Structure Details

### Client Components

**Layout Components** (`components/common/`)
- `Navbar.jsx` - Navigation header
- `Footer.jsx` - Footer component
- `Layout.jsx` - Main layout wrapper
- `Button.jsx` - Reusable button
- `Input.jsx` - Reusable input field
- `Spinner.jsx` - Loading spinner
- `Toast.jsx` - Notification component
- `EmptyState.jsx` - Empty state display
- `ProtectedRoute.jsx` - Protected route wrapper
- `RoleRoute.jsx` - Role-based route wrapper

**Recipe Components** (`components/recipe/`)
- `RecipeCard.jsx` - Recipe card display
- `RecipeForm.jsx` - Create/edit recipe form
- `RecipeFilter.jsx` - Filter recipes
- `StarRating.jsx` - Star rating component

**Chef Components** (`components/chef/`)
- `ChefCard.jsx` - Chef profile card
- `VerifiedBadge.jsx` - Verified chef badge

### Pages

**Public Pages** (`pages/public/`)
- `HomePage.jsx` - Landing page
- `RecipesPage.jsx` - Browse all recipes
- `RecipeDetailPage.jsx` - View recipe details
- `ChefsPage.jsx` - Browse chefs
- `ChefProfilePage.jsx` - Public chef profile

**User Dashboard** (`pages/dashboard/`)
- `DashboardPage.jsx` - User home dashboard
- `MyRecipesPage.jsx` - User's recipes
- `AddRecipePage.jsx` - Create recipe
- `EditRecipePage.jsx` - Edit recipe
- `BookmarksPage.jsx` - Saved recipes
- `ProfilePage.jsx` - User profile

**Chef Dashboard** (`pages/chef/`)
- `ChefDashboardPage.jsx` - Chef overview
- `ChefAnalyticsPage.jsx` - Recipe analytics

**Admin Dashboard** (`pages/admin/`)
- `AdminOverviewPage.jsx` - Admin statistics
- `AdminUsersPage.jsx` - Manage users
- `AdminRecipesPage.jsx` - Manage recipes

### Custom Hooks

- `useAuth.js` - Authentication logic
- `useRecipe.js` - Single recipe operations
- `useRecipes.js` - Multiple recipes operations
- `useBookmarks.js` - Bookmark operations

### Server Middleware

- `auth.middleware.js` - JWT verification
- `role.middleware.js` - Role-based access control
- `validate.middleware.js` - Input validation
- `upload.middleware.js` - File upload to Cloudinary

## Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- Verify the database name in `MONGODB_URI` matches your setup

### Port Already in Use
```bash
# Change PORT in server/.env to a different port (e.g., 5001)
# Or kill the process using the port:
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti :5000 | xargs kill -9
```

### CORS Error
- Ensure `VITE_API_URL` in client `.env.local` matches your server URL
- Check CORS is properly configured in `server/src/app.js`

### Image Upload Fails
- Verify Cloudinary credentials are correct
- Ensure Cloudinary API credentials are set in `server/.env`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue in the repository.

---

**Happy Cooking! 👨‍🍳👩‍🍳**
