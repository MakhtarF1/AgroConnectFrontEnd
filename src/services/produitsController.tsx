import api from "./api"

export const getCategories = async () => {
  const response = await api.get("/produits/categories")
  return response.data
}

export const createProduit = async (productData: any) => {
  const response = await api.post("/produits", productData)
  return response.data
}

