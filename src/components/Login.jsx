import { useState } from 'react'
import { API, setToken, toastError } from '../api'

export default function Login({ onLogin }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    try{
      // endpoint to adjust in backend
      const r = await API.post('/login', { email, password })
      const token = r.data?.token || r.data?.access_token || 'dummy-token'
      setToken(token)
      if (onLogin) onLogin(token)
    }catch(err){
      toastError(err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Acceso</h1>
        <div>
          <label className="block text-sm mb-1 text-slate-600">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="input w-full" placeholder="admin@example.com" required />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-600">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input w-full" required />
        </div>
        <button disabled={loading} className="btn w-full">{loading ? 'Accediendo...' : 'Entrar'}</button>
      </form>
    </div>
  )
}
