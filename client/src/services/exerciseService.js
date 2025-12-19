import api from './api'

export const exerciseService = {
  async getTypes() {
    const response = await api.get('/exercises/types')
    return response.data
  }
}
