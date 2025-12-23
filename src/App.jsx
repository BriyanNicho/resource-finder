import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import './index.css';

// Login Page Component
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const role = result.user?.role ||
        (email === 'admin@kampus.ac.id' ? 'admin' : 'student');
      navigate(role === 'admin' ? '/admin' : '/', { replace: true });
    } else {
      setError(result.error || 'Email atau password salah');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1>Resource Finder</h1>
          <p>Sistem Pemesanan Fasilitas Kampus</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@kampus.ac.id"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo Login:</strong></p>
          <p>👨‍🎓 Mahasiswa: mahasiswa@kampus.ac.id / mhs123</p>
          <p>👨‍💼 Admin: admin@kampus.ac.id / admin123</p>
        </div>
      </div>
    </div>
  );
}

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
        user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace /> : <LoginPage />
      } />

      {/* Student Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['student', 'admin']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Suspense fallback={<LoadingSpinner />}><Home /></Suspense>} />
        <Route path="explore" element={<Suspense fallback={<LoadingSpinner />}><Explore /></Suspense>} />
        <Route path="my-booking" element={<Suspense fallback={<LoadingSpinner />}><MyBooking /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
        <Route path="facility/:id" element={<Suspense fallback={<LoadingSpinner />}><FacilityDetail /></Suspense>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>} />
        <Route path="assets" element={<Suspense fallback={<LoadingSpinner />}><Assets /></Suspense>} />
        <Route path="issues" element={<Suspense fallback={<LoadingSpinner />}><Issues /></Suspense>} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

// Re-export useAuth for backwards compatibility with existing components
export { useAuth } from './hooks/useAuth';

export default App;
