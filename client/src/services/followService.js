import api from './api'

export const followService = {
  async follow(uid) {
    const response = await api.post(`/follows/${uid}`)
    return response.data
  },

  async unfollow(uid) {
    const response = await api.delete(`/follows/${uid}`)
    return response.data
  },

  async getFollowers(uid) {
    const response = await api.get(`/follows/${uid}/followers`)
    return response.data
  },

  async getFollowing(uid) {
    const response = await api.get(`/follows/${uid}/following`)
    return response.data
  },

  async checkStatus(uid) {
    const response = await api.get(`/follows/${uid}/status`)
    return response.data
  }
}
