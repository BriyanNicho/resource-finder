import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';


// Lazy load components
const MainLayout = lazy(() => import('./components/templates/MainLayout'));
const AdminLayout = lazy(() => import('./components/templates/AdminLayout'));
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const MyBooking = lazy(() => import('./pages/MyBooking'));
const Profile = lazy(() => import('./pages/Profile'));
const FacilityDetail = lazy(() => import('./pages/FacilityDetail'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Assets = lazy(() => import('./pages/admin/Assets'));
const Issues = lazy(() => import('./pages/admin/Issues'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const ManageBookings = lazy(() => import('./pages/admin/ManageBookings'));
const ActivityLog = lazy(() => import('./pages/ActivityLog'));
const AdminActivityLog = lazy(() => import('./pages/admin/ActivityLog'));
const Login = lazy(() => import('./pages/Login'));

// Lazy load AdminProvider (Named Export)
const LazyAdminProvider = lazy(() =>
  import('./context/AdminContext').then(module => ({ default: module.AdminProvider }))
);

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Memuat...</p>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

// App Routes Component (needs to be inside Router for useNavigate)
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={
        user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace /> : (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          </ErrorBoundary>
        )
      } />

      {/* Student Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['student', 'admin']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ErrorBoundary><Suspense fallback={<LoadingSpinner />}><Home /></Suspense></ErrorBoundary>} />
        <Route path="explore" element={<ErrorBoundary><Suspense fallback={<LoadingSpinner />}><Explore /></Suspense></ErrorBoundary>} />
        <Route path="my-booking" element={<ErrorBoundary><Suspense fallback={<LoadingSpinner />}><MyBooking /></Suspense></ErrorBoundary>} />
        <Route path="profile" element={<ErrorBoundary><Suspense fallback={<LoadingSpinner />}><Profile /></Suspense></ErrorBoundary>} />
        <Route path="facility/:id" element={<ErrorBoundary><Suspense fallback={<LoadingSpinner />}><FacilityDetail /></Suspense></ErrorBoundary>} />
        <Route path="activity" element={<ErrorBoundary><Suspense fallback={<LoadingSpinner />}><ActivityLog /></Suspense></ErrorBoundary>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <LazyAdminProvider>
                <AdminLayout />
              </LazyAdminProvider>
            </Suspense>
          </ErrorBoundary>
        </ProtectedRoute>
      }>
        <Route index element={<Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>} />
        <Route path="bookings" element={<Suspense fallback={<LoadingSpinner />}><ManageBookings /></Suspense>} />
        <Route path="assets" element={<Suspense fallback={<LoadingSpinner />}><Assets /></Suspense>} />
        <Route path="issues" element={<Suspense fallback={<LoadingSpinner />}><Issues /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<LoadingSpinner />}><AdminUsers /></Suspense>} />
        <Route path="activity" element={<Suspense fallback={<LoadingSpinner />}><AdminActivityLog /></Suspense>} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/resource-finder">
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

// Re-export useAuth for backwards compatibility with existing components
export { useAuth } from './hooks/useAuth';

export default App;
