import api from './api'

export const postService = {
  async createPost(postData) {
    const response = await api.post('/posts', postData)
    return response.data
  },

  async getPost(pid) {
    const response = await api.get(`/posts/${pid}`)
    return response.data
  },

  async deletePost(pid) {
    const response = await api.delete(`/posts/${pid}`)
    return response.data
  },

  async getFeed(limit = 20, offset = 0) {
    const response = await api.get('/posts/feed', {
      params: { limit, offset }
    })
    return response.data
  },

  async getExplore(limit = 20, offset = 0) {
    const response = await api.get('/posts/explore', {
      params: { limit, offset }
    })
    return response.data
  },

  async getUserPosts(uid, limit = 20, offset = 0) {
    const response = await api.get(`/posts/user/${uid}`, {
      params: { limit, offset }
    })
    return response.data
  }
}
