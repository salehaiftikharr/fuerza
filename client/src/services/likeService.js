import api from './api'

export const likeService = {
  async likePost(pid) {
    const response = await api.post(`/likes/${pid}`)
    return response.data
  },

  async unlikePost(pid) {
    const response = await api.delete(`/likes/${pid}`)
    return response.data
  },

  async getLikeStatus(pid) {
    const response = await api.get(`/likes/${pid}/status`)
    return response.data
  },

  async getLikers(pid) {
    const response = await api.get(`/likes/${pid}/users`)
    return response.data
  }
}
