
import { useEffect, useState } from 'react'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

export default function Banks(){
  const [rows, setRows] = useState([])
  const [name, setName] = useState('')

  async function load(){
    try{
      const r = await API.get('/banks')
      setRows(r.data || [])
    }catch(e){ toastError(e) }
  }
  useEffect(()=>{ load() }, [])

  async function add(){
    if(!name) return
    try{
      await API.post('/banks', { nombre:name })
      setName(''); load()
    }catch(e){ toastError(e) }
  }

  return (
    <div className="space-y-4">
      <SectionTitle title="Bancos" />
      <div className="card grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="Nombre banco" value={name} onChange={e=>setName(e.target.value)} />
        <div></div>
        <button className="btn" onClick={add}>Añadir</button>
      </div>

      <div className="card">
        <table className="w-full table">
          <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
          <tbody>
            {(rows || []).map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.nombre}</td>
              </tr>
            ))}
            {(!rows || rows.length===0) && <tr><td colSpan="2" className="py-6 text-center text-gray-500">Sin datos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
