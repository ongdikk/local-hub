import api from './api'

export const loadTourData = async (file, adminPassword) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('admin_password', adminPassword)

  try {
    const response = await api.post('/api/admin/load-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
