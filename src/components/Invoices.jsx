
import { useEffect, useMemo, useState } from 'react'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

export default function Invoices(){
  const [rows, setRows] = useState([])
  const [memberId, setMemberId] = useState('')
  const [amount, setAmount] = useState('')
  const [q, setQ] = useState('')

  async function load(){
    try{
      const r = await API.get('/invoices')
      setRows(r.data || [])
    }catch(e){ toastError(e) }
  }
  useEffect(()=>{ load() }, [])

  async function add(){
    if(!memberId || !amount) return
    try{
      await API.post('/invoices', { member_id:Number(memberId), amount_cents: Math.round(Number(amount)*100) })
      setMemberId(''); setAmount(''); load()
    }catch(e){ toastError(e) }
  }

  const filtered = useMemo(()=>{
    const k = q.toLowerCase().trim()
    if(!k) return rows
    return rows.filter(i => (i.full_number || String(i.id)).toString().toLowerCase().includes(k))
  }, [q, rows])

  return (
    <div className="space-y-4">
      <SectionTitle title="Facturas" />
      <div className="grid md:grid-cols-3 gap-3 card">
        <input className="input" placeholder="ID Miembro" value={memberId} onChange={e=>setMemberId(e.target.value)} />
        <input className="input" placeholder="Importe (€)" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button className="btn" onClick={add}>Crear factura</button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <input className="input max-w-xs" placeholder="Buscar # factura…" value={q} onChange={e=>setQ(e.target.value)} />
          <span className="text-sm text-gray-500">{filtered.length} resultados</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table">
            <thead>
              <tr><th>#</th><th>Fecha</th><th>Importe</th><th>Estado</th><th>PDF</th></tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td>{i.full_number || i.id}</td>
                  <td>{i.issue_date?.slice(0,10) || '-'}</td>
                  <td>{(i.amount_cents/100).toFixed(2)} {i.currency || 'EUR'}</td>
                  <td>
                    <span className={'badge ' + (i.status==='paid' ? 'badge-paid' : i.status==='partial' ? 'badge-partial' : 'badge-open')}>{i.status}</span>
                  </td>
                  <td><a className="btn" href={`${API.defaults.baseURL}/invoices/${i.id}/pdf`} target="_blank">Ver PDF</a></td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan="5" className="py-6 text-center text-gray-500">Sin datos</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
