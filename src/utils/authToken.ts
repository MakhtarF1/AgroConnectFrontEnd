import api from "../services/api"

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"]
}

