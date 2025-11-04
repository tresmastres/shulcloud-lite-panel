import { useEffect, useMemo, useState } from 'react'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'
import { Link } from 'react-router-dom'

function buildCode(members, m){
  const last = (m.last_name || '').toUpperCase().slice(0,3).padEnd(3, 'X')
  const first = (m.first_name || '').toUpperCase().slice(0,3).padEnd(3, 'X')
  const base = last + first
  const siblings = members.filter(mm => {
    const l2 = (mm.last_name || '').toUpperCase().slice(0,3).padEnd(3,'X')
    const f2 = (mm.first_name || '').toUpperCase().slice(0,3).padEnd(3,'X')
    return l2+f2 === base
  })
  const idx = siblings.findIndex(s => s.id === m.id)
  const n = (idx === -1 ? siblings.length : idx+1)
  return `${base}-${String(n).padStart(2,'0')}`
}

export default function Families(){
  const [members, setMembers] = useState([])
  const [q, setQ] = useState('')

  useEffect(()=>{
    async function load(){
      try{
        const r = await API.get('/members')
        setMembers(r.data || [])
      }catch(e){ toastError(e) }
    }
    load()
  }, [])

  // fake families grouped by last_name
  const families = useMemo(()=>{
    const map = {}
    for(const m of members){
      const key = m.last_name || 'Sin apellido'
      if (!map[key]) map[key] = []
      map[key].push(m)
    }
    return Object.entries(map).map(([name, list]) => ({ name, members: list }))
  }, [members])

  const filtered = families.filter(f => f.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Familias" subtitle="Haz click en una familia para ver miembros y acciones" />
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="input" placeholder="Buscar familia..." />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(f => (
          <div key={f.name} className="bg-white rounded-xl shadow p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-700">{f.name}</h2>
              <button className="btn btn-sm" onClick={()=>alert('Aquí iría el formulario para añadir miembro a '+f.name)}>Añadir miembro</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th>Miembro</th>
                  <th>ID</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {f.members.map(m => {
                  const code = buildCode(f.members, m)
                  return (
                    <tr key={m.id} className="border-t">
                      <td>{m.first_name} {m.last_name}</td>
                      <td>{code}</td>
                      <td className="flex gap-2 py-2">
                        <Link to={`/account/${m.id}`} className="btn btn-xs">Estado</Link>
                        <button className="btn btn-xs" onClick={()=>alert('Añadir factura para '+code)}>Factura</button>
                        <button className="btn btn-xs" onClick={()=>alert('Registrar cobro para '+code)}>Cobro</button>
                        <button className="btn btn-xs" onClick={()=>alert('Editar miembro '+code)}>Editar</button>
                      </td>
                    </tr>
                  )
                })}
                {f.members.length===0 && <tr><td colSpan="3" className="py-2 text-slate-400 text-center">Sin miembros</td></tr>}
              </tbody>
            </table>
          </div>
        ))}
        {filtered.length===0 && <p className="text-slate-400">Sin familias</p>}
      </div>
    </div>
  )
}
