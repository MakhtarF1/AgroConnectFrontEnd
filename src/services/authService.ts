import api from "./api"

export const login = async (telephone: string, mot_de_passe: string) => {
  const response = await api.post("/auth/login", { telephone, mot_de_passe })
  return response.data
}

export const register = async (userData: {
  prenom: string
  nom: string
  telephone: string
  email?: string
  mot_de_passe: string
  type_utilisateur: string
}) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

export const getUserProfile = async () => {
  const response = await api.get("/auth/profile")
  return response.data
}

export const updateUserProfile = async (userData: any) => {
  const response = await api.put("/auth/profile", userData)
  return response.data
}

