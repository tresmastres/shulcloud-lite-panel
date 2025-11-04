import axios from 'axios'
const base = import.meta.env.VITE_API_BASE || 'https://or-hayeladim.onrender.com'
export const API = axios.create({ baseURL: base })

// attach token from localStorage if exists
const saved = (typeof window !== 'undefined') ? localStorage.getItem('token') : null
if (saved) {
  API.defaults.headers.common['Authorization'] = `Bearer ${saved}`
}

export function setToken(token){
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function toastError(err){
  const msg = err?.response?.data?.detail || err.message || 'Error'
  alert(msg)
}
