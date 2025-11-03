
import axios from 'axios'
const base = import.meta.env.VITE_API_BASE || 'https://or-hayeladim.onrender.com'
export const API = axios.create({ baseURL: base })
export function toastError(err){
  const msg = err?.response?.data?.detail || err.message || 'Error'
  alert(msg)
}
