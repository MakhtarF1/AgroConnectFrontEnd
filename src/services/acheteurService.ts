import api from "./api"

export const getProducts = async (page = 1, keyword = "") => {
  const response = await api.get(`/produits?page=${page}&keyword=${keyword}`)
  return response.data
}

export const getProductById = async (id: string) => {
  const response = await api.get(`/produits/${id}`)
  return response.data
}

export const getOffers = async (page = 1, keyword = "") => {
  const response = await api.get(`/offres?page=${page}&keyword=${keyword}`)
  return response.data
}

export const getOfferById = async (id: string) => {
  const response = await api.get(`/offres/${id}`)
  return response.data
}

export const createOrder = async (orderData: any) => {
  const response = await api.post("/commandes", orderData)
  return response.data
}

export const getOrders = async (page = 1) => {
  const response = await api.get(`/commandes?page=${page}`)
  return response.data
}

export const getOrderById = async (id: string) => {
  const response = await api.get(`/commandes/${id}`)
  return response.data
}

export const createPayment = async (paymentData: any) => {
  const response = await api.post("/paiements", paymentData)
  return response.data
}

export const simulateOrangeMoney = async (paymentData: any) => {
  const response = await api.post("/paiements/simuler-orange-money", paymentData)
  return response.data
}

export const simulateWave = async (paymentData: any) => {
  const response = await api.post("/paiements/simuler-wave", paymentData)
  return response.data
}

export const uploadPaymentProof = async (paymentId: string, formData: FormData) => {
  const response = await api.post(`/paiements/${paymentId}/preuve`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

