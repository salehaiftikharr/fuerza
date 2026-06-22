import axios from 'axios'
import { isDemoMode } from '../demo/demoMode'
import demoAdapter from '../demo/demoAdapter'

// Production builds point at the deployed Render API; local dev falls back to
// the Vite proxy. Override anytime with a VITE_API_URL env var.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://fuerza-api.onrender.com' : '')

const defaultAdapter = axios.getAdapter(axios.defaults.adapter)

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// In Live Demo mode, serve every request from the in-memory store so the
// deployed site works with no backend. Otherwise use the real network adapter.
api.defaults.adapter = (config) =>
  isDemoMode() ? demoAdapter(config) : defaultAdapter(config)

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefreshToken } = response.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
