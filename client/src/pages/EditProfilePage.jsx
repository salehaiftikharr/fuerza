import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import './EditProfilePage.css'

const EditProfilePage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    profile_bio: user?.profile_bio || ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(user?.profile_picture)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Update profile info
      const result = await userService.updateProfile(formData)
      updateUser(result.user)

      // Upload picture if selected
      if (selectedFile) {
        const pictureResult = await userService.uploadProfilePicture(selectedFile)
        updateUser({ profile_picture: pictureResult.profile_picture })
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => navigate(`/profile/${user.username}`), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h1>Edit Profile</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="picture-section">
            <img
              src={preview || '/uploads/default-avatar.png'}
              alt="Profile preview"
              className="picture-preview"
            />
            <label className="picture-upload-btn">
              Change Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile_bio">Bio</label>
            <textarea
              id="profile_bio"
              name="profile_bio"
              className="form-control"
              value={formData.profile_bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfilePage
