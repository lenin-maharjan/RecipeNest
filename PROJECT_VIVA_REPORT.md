# RecipeNest - Viva and Assignment Report

## Student Information
- Student Name: ______________________________
- Student ID: ______________________________
- Section: ______________________________
- Assigned Viva Date: ______________________________
- Course/Subject: ______________________________
- Project Type: Individual / Group (circle one)
- If Group, My Individual Contribution: ______________________________

---

## Project Title
RecipeNest - Recipe Sharing and Management Web Application

## Project Overview
RecipeNest is a full-stack web application where users can discover recipes, bookmark favorites, and interact through reviews. The system supports role-based access for normal users, chefs, and admin users.

### Main Objectives
- Build a practical full-stack project using modern web technologies.
- Implement secure authentication and role-based authorization.
- Design a responsive user interface for recipe discovery and management.
- Create structured REST APIs with proper CRUD operations.

### Core Features
- User registration and login
- Role-based routes (User / Chef / Admin)
- Recipe listing, filtering, detail view
- Add, edit, and manage recipes (dashboard features)
- Bookmark system
- Review system
- Chef profile and analytics pages
- Admin panels for users/recipes overview

---

## 1. Application Overview & Frontend (30 Marks)

### Purpose and Features
The frontend provides an intuitive interface for exploring recipes and managing user actions such as authentication, bookmarking, and reviews.

### UI/UX Design and Responsiveness
- Built with React + Vite for fast rendering and development workflow.
- Tailwind CSS is used for styling and responsive layouts.
- Reusable components improve consistency:
  - Common: Button, Input, Navbar, Footer, Spinner, Toast, Layout
  - Recipe: RecipeCard, RecipeForm, RecipeFilter, StarRating
  - Chef: ChefCard, VerifiedBadge
- Separate pages for public users, auth flow, dashboard, chef area, and admin area.

### Client-side Logic
- Routing with protected/role routes:
  - ProtectedRoute
  - RoleRoute
- API communication through Axios wrapper and dedicated API modules.
- State and auth management using React Context (AuthContext) and custom hooks:
  - useAuth
  - useBookmarks
  - useRecipe / useRecipes
- Form handling with react-hook-form.

---

## 2. Backend, API & Database (30 Marks)

### Server-side Development
- Backend built with Node.js and Express.
- Organized architecture with folders for:
  - controllers
  - routes
  - models
  - middleware
  - config
  - utils

### REST API Implementation
Implemented route modules:
- auth routes
- user routes
- recipe routes
- review routes
- bookmark routes
- admin routes

Each route follows REST principles and is connected to controller logic for request handling and response formatting.

### Database Design and CRUD Operations
- MongoDB used with Mongoose ODM.
- Main models:
  - user.model
  - recipe.model
  - review.model
  - bookmark.model
  - upload.model
- CRUD operations implemented for recipes, reviews, bookmarks, and user/admin management.

### Security and Best Practices
- JWT-based authentication
- Password hashing with bcryptjs
- Middleware-based authorization and validation
- Input validation with express-validator
- Security middleware:
  - helmet
  - cors
  - express-rate-limit
- Structured API response/error helpers:
  - apiResponse utility
  - AppError utility
- Cloud image handling with multer + Cloudinary

---

## 3. Testing, Deployment & Understanding (5 Marks)

### Testing and Debugging Approach
- Manual API testing by verifying endpoints and response behavior.
- Frontend testing through page-level user flow checks:
  - Auth flow
  - Recipe create/edit/view
  - Bookmark and review actions
- Debugging performed using browser dev tools, server logs, and endpoint validation.

### Project Setup and Execution
1. Install dependencies in both folders:
   - client
   - server
2. Run frontend:
   - npm run dev (inside client)
3. Run backend:
   - npm run dev (inside server)
4. Configure environment variables for DB connection, JWT secret, and Cloudinary credentials.

### Individual Understanding
I can independently explain:
- Project architecture and folder structure
- Frontend-backend API communication flow
- Authentication and authorization process
- CRUD logic for major entities
- My specific contribution in development and debugging

---

## 4. Assignment Report (25 Marks)

### Documentation Completeness and Clarity
This report documents:
- Project goal and problem solved
- Technology stack
- Major modules and features
- API/database and security implementation
- Setup and execution steps

### Project and Code Documentation
- Clear separation between client and server layers
- Modular file/folder structure for scalability
- Reusable components and middleware
- Utility-based response and error handling

### Feature Functionality Explanation
- Public users can browse recipes and chefs.
- Authenticated users can bookmark and review recipes.
- Dashboard users can manage personal profile and recipes.
- Chef section includes profile and analytics-related pages.
- Admin can monitor users, recipes, and platform status.

---

## 5. Class Discipline & Professionalism (10 Marks)

### Professional Conduct Statement
- I will attend viva on the assigned date and time.
- I understand viva is an individual assessment.
- I will explain my own implementation honestly and clearly.
- I will maintain professional behavior during evaluation.

---

## Technology Stack Summary

### Frontend
- React
- Vite
- React Router DOM
- Axios
- React Hook Form
- Tailwind CSS

### Backend
- Node.js
- Express
- Mongoose
- JWT
- bcryptjs
- Express Validator
- Multer + Cloudinary

### Database
- MongoDB

---

## Module and Dependency Summary

### Total Modules/Files Used (Current Codebase)
- Source files in `client/src` + `server/src`: 82
- JavaScript/JSX code modules only: 78
  - Frontend code modules: 50
  - Backend code modules: 28
- Non-code source files in `src` folders: 4
  - 1 CSS file (`client/src/index.css`)
  - 3 asset files (`client/src/assets/*`)

### Dependencies Used

#### Client (`client/package.json`)
- Runtime dependencies: 6
- Dev dependencies: 9
- Client total: 15

#### Server (`server/package.json`)
- Runtime dependencies: 13
- Dev dependencies: 1
- Server total: 14

#### Combined Project Total
- Runtime dependencies (client + server): 19
- Dev dependencies (client + server): 10
- Grand total dependency entries: 29

---

## Brief Description of Project Files

### Root Files
- `README.md`: Main project readme (currently empty).
- `package-lock.json`: Lock file for exact dependency versions.

### Client Root Files
- `client/package.json`: Frontend scripts and dependency definitions.
- `client/index.html`: Vite HTML entry template.
- `client/vite.config.js`: Vite build and dev server configuration.
- `client/tailwind.config.js`: Tailwind theme and content configuration.
- `client/postcss.config.js`: PostCSS plugin setup.
- `client/eslint.config.js`: Frontend linting rules.
- `client/README.md`: Client-specific notes/documentation.

### Client Source (`client/src`)
- `client/src/main.jsx`: React app bootstrap and root render.
- `client/src/App.jsx`: Main app routes/layout composition.
- `client/src/index.css`: Global styles and Tailwind layers.

### Client API Modules
- `client/src/api/axios.js`: Central Axios instance and base config.
- `client/src/api/auth.api.js`: Auth API calls (login/register/profile auth actions).
- `client/src/api/user.api.js`: User-related API operations.
- `client/src/api/recipe.api.js`: Recipe CRUD and listing API calls.
- `client/src/api/review.api.js`: Review create/read/update/delete API calls.
- `client/src/api/bookmark.api.js`: Bookmark add/remove/list API calls.
- `client/src/api/admin.api.js`: Admin dashboard/management API calls.

### Client Assets
- `client/src/assets/hero.png`: Hero/banner image asset.
- `client/src/assets/react.svg`: React logo asset.
- `client/src/assets/vite.svg`: Vite logo asset.

### Client Components - Chef
- `client/src/components/chef/ChefCard.jsx`: Reusable chef profile card UI.
- `client/src/components/chef/VerifiedBadge.jsx`: Visual badge for verified chef state.

### Client Components - Common
- `client/src/components/common/Button.jsx`: Reusable button component.
- `client/src/components/common/Input.jsx`: Reusable form input component.
- `client/src/components/common/Navbar.jsx`: Main top navigation bar.
- `client/src/components/common/Footer.jsx`: Shared footer section.
- `client/src/components/common/Layout.jsx`: Common page layout wrapper.
- `client/src/components/common/Spinner.jsx`: Loading spinner UI.
- `client/src/components/common/Toast.jsx`: Toast notifications wrapper/component.
- `client/src/components/common/EmptyState.jsx`: Fallback UI when data is empty.
- `client/src/components/common/SkeletonCard.jsx`: Skeleton loader card placeholder.
- `client/src/components/common/ProtectedRoute.jsx`: Auth-based route protection.
- `client/src/components/common/RoleRoute.jsx`: Role-based route authorization.

### Client Components - Recipe
- `client/src/components/recipe/RecipeCard.jsx`: Recipe preview card.
- `client/src/components/recipe/RecipeFilter.jsx`: Recipe filtering controls.
- `client/src/components/recipe/RecipeForm.jsx`: Add/Edit recipe form component.
- `client/src/components/recipe/StarRating.jsx`: Star rating display/input component.

### Client Context and Hooks
- `client/src/context/AuthContext.jsx`: Global authentication state provider.
- `client/src/hooks/useAuth.js`: Hook to consume auth context/actions.
- `client/src/hooks/useBookmarks.js`: Hook for bookmark-related state/actions.
- `client/src/hooks/useRecipe.js`: Hook for single-recipe data logic.
- `client/src/hooks/useRecipes.js`: Hook for recipe list fetching/state logic.

### Client Pages - Public/Auth/Admin/Chef/Dashboard
- `client/src/pages/NotFoundPage.jsx`: 404 page.
- `client/src/pages/public/HomePage.jsx`: Public landing/home page.
- `client/src/pages/public/RecipesPage.jsx`: Public recipe listing page.
- `client/src/pages/public/RecipeDetailPage.jsx`: Single recipe detail page.
- `client/src/pages/public/ChefsPage.jsx`: Chef listing page.
- `client/src/pages/public/ChefProfilePage.jsx`: Individual chef profile page.
- `client/src/pages/auth/LoginPage.jsx`: Login page.
- `client/src/pages/auth/RegisterPage.jsx`: Registration page.
- `client/src/pages/admin/AdminOverviewPage.jsx`: Admin overview dashboard page.
- `client/src/pages/admin/AdminUsersPage.jsx`: Admin user management page.
- `client/src/pages/admin/AdminRecipesPage.jsx`: Admin recipe management page.
- `client/src/pages/chef/ChefDashboardPage.jsx`: Chef-specific dashboard page.
- `client/src/pages/chef/ChefAnalyticsPage.jsx`: Chef analytics/insight page.
- `client/src/pages/dashboard/DashboardPage.jsx`: User dashboard home.
- `client/src/pages/dashboard/ProfilePage.jsx`: User profile management page.
- `client/src/pages/dashboard/MyRecipesPage.jsx`: Logged-in user recipe list page.
- `client/src/pages/dashboard/AddRecipePage.jsx`: Add new recipe page.
- `client/src/pages/dashboard/EditRecipePage.jsx`: Edit existing recipe page.
- `client/src/pages/dashboard/BookmarksPage.jsx`: Saved bookmarks page.

### Server Root Files
- `server/package.json`: Backend scripts and dependencies.

### Server Source (`server/src`)
- `server/src/server.js`: Backend entry point and server startup.
- `server/src/app.js`: Express app setup, middlewares, and routes mounting.

### Server Config
- `server/src/config/db.js`: Database connection setup.
- `server/src/config/cloudinary.js`: Cloudinary configuration for uploads.

### Server Controllers
- `server/src/controllers/auth.controller.js`: Authentication request handlers.
- `server/src/controllers/user.controller.js`: User profile/account handlers.
- `server/src/controllers/recipe.controller.js`: Recipe business logic handlers.
- `server/src/controllers/review.controller.js`: Review handlers.
- `server/src/controllers/bookmark.controller.js`: Bookmark handlers.
- `server/src/controllers/admin.controller.js`: Admin operations handlers.

### Server Middleware
- `server/src/middleware/auth.middleware.js`: JWT auth verification middleware.
- `server/src/middleware/role.middleware.js`: Role authorization middleware.
- `server/src/middleware/validate.middleware.js`: Request validation result handler.
- `server/src/middleware/upload.middleware.js`: File upload handling middleware.

### Server Models
- `server/src/models/user.model.js`: User schema/model.
- `server/src/models/recipe.model.js`: Recipe schema/model.
- `server/src/models/review.model.js`: Review schema/model.
- `server/src/models/bookmark.model.js`: Bookmark schema/model.
- `server/src/models/upload.model.js`: Upload metadata schema/model.

### Server Routes
- `server/src/routes/auth.routes.js`: Auth endpoint routes.
- `server/src/routes/user.routes.js`: User endpoint routes.
- `server/src/routes/recipe.routes.js`: Recipe endpoint routes.
- `server/src/routes/review.routes.js`: Review endpoint routes.
- `server/src/routes/bookmark.routes.js`: Bookmark endpoint routes.
- `server/src/routes/admin.routes.js`: Admin endpoint routes.

### Server Utilities
- `server/src/utils/apiResponse.js`: Standard API success response helper.
- `server/src/utils/AppError.js`: Custom application error class/helper.
- `server/src/utils/generateToken.js`: JWT creation helper.

---

## Possible Viva Questions and Ready Answers

### Q1. Why did you separate client and server?
A: To keep concerns separated, improve maintainability, and allow independent development/deployment of UI and API layers.

### Q2. How is authentication handled?
A: User logs in, server verifies credentials, then issues JWT. Protected routes validate token via auth middleware.

### Q3. How did you secure the backend?
A: I used hashed passwords, JWT auth, route-level authorization, input validation, helmet, CORS, and rate limiting.

### Q4. How are CRUD operations implemented?
A: Each entity has route-controller-model flow. Controllers handle create/read/update/delete with validation and structured responses.

### Q5. What was your personal contribution?
A: (Write your exact contribution here before viva.)

---

## Individual Contribution (Fill Before Submission)
- Modules/Pages I built: ___________________________________________
- APIs/Backend parts I implemented: ___________________________________________
- Bugs I fixed and how: ___________________________________________
- Challenges faced and solutions: ___________________________________________

---

## Conclusion
RecipeNest demonstrates full-stack development capabilities including frontend UI, backend API architecture, database operations, authentication, and role-based access control. The project reflects practical implementation, modular coding practices, and readiness for real-world web application development.
