import api from './api'

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  async signup(userData) {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },

  async logout(refreshToken) {
    const response = await api.post('/auth/logout', { refreshToken })
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refresh(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  }
}
