import api from "./api"

// Exploitations
export const getExploitations = async () => {
  const response = await api.get("/agriculteurs/exploitations")
  return response.data
}

export const getExploitationById = async (id: string) => {
  const response = await api.get(`/agriculteurs/exploitations/${id}`)
  return response.data
}

export const createExploitation = async (exploitationData: any) => {
  const response = await api.post("/agriculteurs/exploitations", exploitationData)
  return response.data
}

export const updateExploitation = async (id: string, exploitationData: any) => {
  const response = await api.put(`/agriculteurs/exploitations/${id}`, exploitationData)
  return response.data
}

export const deleteExploitation = async (id: string) => {
  const response = await api.delete(`/agriculteurs/exploitations/${id}`)
  return response.data
}

export const uploadExploitationPhoto = async (id: string, formData: FormData) => {
  const response = await api.post(`/agriculteurs/exploitations/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const getFarmerStatistics = async () => {
  const response = await api.get("/agriculteurs/statistiques")
  return response.data
}

// Products
export const getCategories = async () => {
  const response = await api.get("/produits/categories")
  return response.data
}

export const createProduct = async (productData: any) => {
  const response = await api.post("/produits", productData)
  return response.data
}

export const updateProduct = async (id: string, productData: any) => {
  const response = await api.put(`/produits/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/produits/${id}`)
  return response.data
}

// Offers
export const createOffer = async (offerData: any) => {
  const response = await api.post("/offres", offerData)
  return response.data
}

export const getMyOffers = async () => {
  const response = await api.get("/offres?vendeur=me")
  return response.data
}

export const updateOffer = async (id: string, offerData: any) => {
  const response = await api.put(`/offres/${id}`, offerData)
  return response.data
}

export const deleteOffer = async (id: string) => {
  const response = await api.delete(`/offres/${id}`)
  return response.data
}

// Orders
export const getSellerOrders = async (page = 1) => {
  const response = await api.get(`/commandes/vendeur?page=${page}`)
  return response.data
}

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.put(`/commandes/${id}/statut`, { statut: status })
  return response.data
}

