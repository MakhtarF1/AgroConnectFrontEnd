import { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/common/ProtectedRoute"
import LoadingScreen from "./components/common/LoadingScreen"

// Layouts
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"))
const Register = lazy(() => import("./pages/auth/Register"))
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"))

// Common Pages
const Home = lazy(() => import("./pages/Home"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Profile = lazy(() => import("./pages/Profile"))

// Acheteur Pages
const AcheteurDashboard = lazy(() => import("./pages/acheteur/Dashboard"))
const ProductList = lazy(() => import("./pages/acheteur/ProductList"))
const ProductDetail = lazy(() => import("./pages/acheteur/ProductDetail"))
const Cart = lazy(() => import("./pages/acheteur/Cart"))
const Checkout = lazy(() => import("./pages/acheteur/Checkout"))
const OrderHistory = lazy(() => import("./pages/acheteur/OrderHistory"))
const OrderDetail = lazy(() => import("./pages/acheteur/OrderDetail"))

// Agriculteur Pages
const AgriculteurDashboard = lazy(() => import("./pages/agriculteur/Dashboard"))
const ExploitationList = lazy(() => import("./pages/agriculteur/ExploitationList"))

function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            {/* Common Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Acheteur Routes */}
            <Route
              path="/acheteur"
              element={
                <ProtectedRoute requiredRole="acheteur">
                  <AcheteurDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute requiredRole="acheteur">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requiredRole="acheteur">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requiredRole="acheteur">
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />

            {/* Agriculteur Routes */}
            <Route
              path="/agriculteur"
              element={
                <ProtectedRoute requiredRole="agriculteur">
                  <AgriculteurDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exploitations"
              element={
                <ProtectedRoute requiredRole="agriculteur">
                  <ExploitationList />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </>
  )
}

export default App

