import api from './api'

export const userService = {
  async getProfile(username) {
    const response = await api.get(`/users/${username}`)
    return response.data
  },

  async updateProfile(data) {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  async uploadProfilePicture(file) {
    const formData = new FormData()
    formData.append('picture', file)

    const response = await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async search(term, searchBy = 'username') {
    const response = await api.get('/users/search/query', {
      params: { term, searchBy }
    })
    return response.data
  }
}
