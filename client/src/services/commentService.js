import api from './api'

export const commentService = {
  async getComments(pid) {
    const response = await api.get(`/comments/${pid}`)
    return response.data
  },

  async createComment(pid, content) {
    const response = await api.post(`/comments/${pid}`, { content })
    return response.data
  },

  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  }
}
