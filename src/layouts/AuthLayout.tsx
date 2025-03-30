"use client"

import { Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import LoadingScreen from "../components/common/LoadingScreen"
import Logo from "../components/common/Logo"

const AuthLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    // Redirect based on user type
    if (user?.type_utilisateur === "agriculteur") {
      return <Navigate to="/agriculteur" replace />
    } else if (user?.type_utilisateur === "acheteur") {
      return <Navigate to="/acheteur" replace />
    }
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="w-20 h-20" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">AgroConnect</h2>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

