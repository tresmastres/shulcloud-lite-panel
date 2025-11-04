import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

function buildCodes(list){
  const map = {}
  const result = {}
  for (const m of list){
    const last = (m.last_name || '').toUpperCase().slice(0,3).padEnd(3,'X')
    const first = (m.first_name || '').toUpperCase().slice(0,3).padEnd(3,'X')
    const base = last + first
    map[base] = (map[base] || 0) + 1
    const num = String(map[base]).padStart(2,'0')
    result[m.id] = `${base}-${num}`
  }
  return result
}

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

  const codes = useMemo(()=>buildCodes(rows), [rows])

  const filtered = rows.filter(m => {
    return (
      (!q || (m.first_name + ' ' + m.last_name).toLowerCase().includes(q.toLowerCase()))
      && (!first || (m.first_name || '').toLowerCase().includes(first.toLowerCase()))
      && (!last || (m.last_name || '').toLowerCase().includes(last.toLowerCase()))
    )
  })

  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Miembros" subtitle="Listado de personas" />
      <div className="grid md:grid-cols-3 gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="input" placeholder="Buscar..." />
        <input value={first} onChange={e=>setFirst(e.target.value)} className="input" placeholder="Nombre" />
        <input value={last} onChange={e=>setLast(e.target.value)} className="input" placeholder="Apellido" />
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table">
          <thead>
            <tr><th>Miembro</th><th>ID</th><th>Móvil</th><th>Email</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td className="py-2">{m.first_name} {m.last_name}</td>
                <td>{codes[m.id]}</td>
                <td>{m.mobile || m.phone || '-'}</td>
                <td>{m.email || '-'}</td>
                <td>
                  <Link to={`/account/${m.id}`} className="btn btn-xs">Estado de cuenta</Link>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan="5" className="py-6 text-center text-gray-500">Sin datos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
