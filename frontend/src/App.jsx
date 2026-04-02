import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingActions from './components/FloatingActions';

// Pages - Lazy Loaded
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const OrderTrack = lazy(() => import('./pages/OrderTrack'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Offers = lazy(() => import('./pages/Offers'));
const Combos = lazy(() => import('./pages/Combos'));
const Account = lazy(() => import('./pages/Account'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminStock = lazy(() => import('./pages/admin/Stock'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const ProductManager = lazy(() => import('./pages/admin/ProductManager'));

// Animated Route Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Admin Components
import AdminLayout from './components/admin/AdminLayout';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
        <Route path="/menu/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/offers" element={<PageWrapper><Offers /></PageWrapper>} />
        <Route path="/combos" element={<PageWrapper><Combos /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/track/:id" element={<PageWrapper><OrderTrack /></PageWrapper>} />
        <Route path="/track" element={<PageWrapper><OrderTrack /></PageWrapper>} />

        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

        {/* User Protected Routes */}
        <Route path="/orders" element={
          <ProtectedRoute>
            <PageWrapper><OrderHistory /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <PageWrapper><Account /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/auth/callback" element={<PageWrapper><AuthCallback /></PageWrapper>} />

        {/* Admin Protected Routes - Wrapped in AdminLayout */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout title="System Dashboard">
              <PageWrapper><Dashboard /></PageWrapper>
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/orders" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout title="Order Management">
              <PageWrapper><AdminOrders /></PageWrapper>
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/stock" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout title="Inventory Control">
              <PageWrapper><AdminStock /></PageWrapper>
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/reviews" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout title="Review Moderation">
              <PageWrapper><AdminReviews /></PageWrapper>
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout title="Product Catalog">
              <PageWrapper><ProductManager /></PageWrapper>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`app-luxury-wrapper ${isAdminRoute ? 'admin-view' : ''}`}>
      {!isAdminRoute && <Navbar />}
      
      <main className={`min-h-screen ${isAdminRoute ? 'admin-main' : 'main-content'}`}>
        <Suspense fallback={<LoadingOverlay />}>
          <AnimatedRoutes />
        </Suspense>
        {!isAdminRoute && <FloatingActions />}
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;

