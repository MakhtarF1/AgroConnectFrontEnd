"use client"

import type { FC, ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import LoadingScreen from "./LoadingScreen"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "agriculteur" | "acheteur" | "vendeur_materiel" | "transformateur" | "livreur" | "administrateur"
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.type_utilisateur !== requiredRole) {
    return <Navigate to="/404" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

