import api from './api'

export const messageService = {
  async getConversations() {
    const response = await api.get('/messages/conversations')
    return response.data
  },

  async getMessages(uid, limit = 50, offset = 0) {
    const response = await api.get(`/messages/${uid}`, {
      params: { limit, offset }
    })
    return response.data
  },

  async sendMessage(uid, contents) {
    const response = await api.post(`/messages/${uid}`, { contents })
    return response.data
  },

  async markAsRead(uid) {
    const response = await api.put(`/messages/${uid}/read`)
    return response.data
  },

  async getUnreadCount() {
    const response = await api.get('/messages/unread')
    return response.data
  }
}
