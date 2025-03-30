"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { setAuthToken, removeAuthToken } from "../utils/authToken"
import toast from "react-hot-toast"

interface User {
  _id: string
  prenom: string
  nom: string
  telephone: string
  email?: string
  type_utilisateur: "agriculteur" | "acheteur" | "vendeur_materiel" | "transformateur" | "livreur" | "administrateur"
  photo_profil?: string
  localisation?: {
    region?: string
    adresse?: string
    coordonnees_gps?: {
      latitude: number
      longitude: number
    }
  }
  statut_verification?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (telephone: string, mot_de_passe: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

interface RegisterData {
  prenom: string
  nom: string
  telephone: string
  email?: string
  mot_de_passe: string
  type_utilisateur: "agriculteur" | "acheteur"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setAuthToken(token)
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get("/auth/profile")
      setUser(data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      // Si l'erreur est 401 (non autorisé), déconnectez l'utilisateur
      if (error.response && error.response.status === 401) {
        logout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (telephone: string, mot_de_passe: string) => {
    try {
      setIsLoading(true)
      const { data } = await api.post("/auth/login", { telephone, mot_de_passe })

      // Vérifier que la réponse contient un token
      if (!data.token) {
        throw new Error("Token d'authentification manquant dans la réponse")
      }

      localStorage.setItem("token", data.token)
      setAuthToken(data.token)
      setUser(data)
      toast.success(`Bienvenue, ${data.prenom} !`)

      // Redirect based on user type
      if (data.type_utilisateur === "agriculteur") {
        navigate("/agriculteur")
      } else if (data.type_utilisateur === "acheteur") {
        navigate("/acheteur")
      } else {
        navigate("/")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Erreur de connexion")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const { data } = await api.post("/auth/register", userData)

      // Vérifier que la réponse contient un token
      if (!data.token) {
        throw new Error("Token d'authentification manquant dans la réponse")
      }

      localStorage.setItem("token", data.token)
      setAuthToken(data.token)
      setUser(data)
      toast.success("Inscription réussie !")

      // Redirect based on user type
      if (data.type_utilisateur === "agriculteur") {
        navigate("/agriculteur")
      } else if (data.type_utilisateur === "acheteur") {
        navigate("/acheteur")
      } else {
        navigate("/")
      }
    } catch (error: any) {
      console.error("Register error:", error)
      toast.error(error.response?.data?.message || "Erreur d'inscription")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      const { data } = await api.put("/auth/profile", userData)
      setUser(data)
      toast.success("Profil mis à jour avec succès")
    } catch (error: any) {
      console.error("Update profile error:", error)
      toast.error(error.response?.data?.message || "Erreur de mise à jour du profil")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    removeAuthToken()
    setUser(null)
    navigate("/login")
    toast.success("Vous avez été déconnecté avec succès")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

