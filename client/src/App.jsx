import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';

// public pages
import HomePage from './pages/public/HomePage';
import RecipesPage from './pages/public/RecipesPage';
import RecipeDetailPage from './pages/public/RecipeDetailPage';
import ChefProfilePage from './pages/public/ChefProfilePage';
import ChefsPage from './pages/public/ChefsPage';

// auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import MyRecipesPage from './pages/dashboard/MyRecipesPage';
import AddRecipePage from './pages/dashboard/AddRecipePage';
import EditRecipePage from './pages/dashboard/EditRecipePage';
import BookmarksPage from './pages/dashboard/BookmarksPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// admin pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRecipesPage from './pages/admin/AdminRecipesPage';

// chef pages
import ChefDashboardPage from './pages/chef/ChefDashboardPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1a1107',
            color: '#FFFCF5',
            borderRadius: '8px',
            fontSize: '13px',
            border: '0.5px solid rgba(255,255,255,0.08)',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          success: { iconTheme: { primary: '#B5451B', secondary: '#FFFCF5' }},
          error:   { iconTheme: { primary: '#ef4444', secondary: '#FFFCF5' }},
        }} />
        <Routes>

          {/* public routes — anyone can access */}
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/chefs" element={<ChefsPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/chef/:id" element={<ChefProfilePage />} />
          <Route path="/chefs/:id" element={<ChefProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected routes — must be logged in */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/my-recipes" element={
            <ProtectedRoute><MyRecipesPage /></ProtectedRoute>
          } />
          <Route path="/recipes/add" element={
            <ProtectedRoute><AddRecipePage /></ProtectedRoute>
          } />
          <Route path="/recipes/edit/:id" element={
            <ProtectedRoute><EditRecipePage /></ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute><BookmarksPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* chef routes — must be chef or admin */}
          <Route path="/chef-dashboard" element={
            <RoleRoute roles={['chef', 'admin']}>
              <ChefDashboardPage />
            </RoleRoute>
          } />

          {/* admin routes — must be admin */}
          <Route path="/admin" element={
            <RoleRoute roles={['admin']}>
              <AdminOverviewPage />
            </RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute roles={['admin']}>
              <AdminUsersPage />
            </RoleRoute>
          } />
          <Route path="/admin/recipes" element={
            <RoleRoute roles={['admin']}>
              <AdminRecipesPage />
            </RoleRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<div>404 — Page not found</div>} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;