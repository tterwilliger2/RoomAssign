import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000',
})

export function setAuth(token: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

// Initialize auth header from localStorage if present
try {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (saved) setAuth(saved)
} catch {}

export const AuthAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (email: string, password: string) => api.post('/auth/register', { email, password }).then(r => r.data),
}

export const UploadAPI = {
  uploadCSV: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/upload/csv', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
  },
}

export const ConfigAPI = {
  save: (datasetId: number, config: any) => api.post('/config', { datasetId, config }).then(r => r.data),
}

export const OptimizeAPI = {
  run: (datasetId: number, configId: number, timeLimitSec = 60) =>
    api.post('/optimize', { datasetId, configId, timeLimitSec }).then(r => r.data),
}

export const SolutionAPI = {
  applyMove: (solutionId: number, payload: { memberId: string, fromRoomId?: string | null, toRoomId?: string | null }) =>
    api.post(`/solution/${solutionId}/apply-move`, payload).then(r => r.data),
}

export default api
