
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

export default function Members(){
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')

  async function load(){
    try{
      const r = await API.get('/members')
      setRows(r.data || [])
    }catch(e){ toastError(e) }
  }
  useEffect(()=>{ load() }, [])

  async function add(){
    if(!first || !last) return
    try{
      await API.post('/members', { first_name:first, last_name:last })
      setFirst(''); setLast('')
      load()
    }catch(e){ toastError(e) }
  }

  const filtered = useMemo(()=>{
    const k = q.toLowerCase().trim()
    if(!k) return rows
    return rows.filter(m => (`${m.first_name} ${m.last_name}`.toLowerCase().includes(k)))
  }, [q, rows])

  return (
    <div className="space-y-4">
      <SectionTitle title="Miembros" />
      <div className="grid md:grid-cols-3 gap-3 card">
        <input className="input" placeholder="Nombre" value={first} onChange={e=>setFirst(e.target.value)} />
        <input className="input" placeholder="Apellido" value={last} onChange={e=>setLast(e.target.value)} />
        <button className="btn" onClick={add}>Añadir</button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <input className="input max-w-xs" placeholder="Buscar…" value={q} onChange={e=>setQ(e.target.value)} />
          <span className="text-sm text-gray-500">{filtered.length} resultados</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table">
            <thead>
              <tr><th>Nombre</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td className="py-2">{m.first_name} {m.last_name}</td>
                  <td className="py-2">
                    <Link to={`/account/${m.id}`} className="btn">Estado de cuenta</Link>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan="2" className="py-6 text-center text-gray-500">Sin datos</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
