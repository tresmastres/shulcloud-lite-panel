import { useEffect, useMemo, useState } from 'react'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

export default function Invoices(){
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [paying, setPaying] = useState(null)
  const [amount, setAmount] = useState('')

  async function load(){
    try{
      const r = await API.get('/invoices')
      setRows(r.data || [])
    }catch(e){ toastError(e) }
  }

  useEffect(()=>{ load() }, [])

  const filtered = rows.filter(i => !q || (i.full_number || '').toLowerCase().includes(q.toLowerCase()) || (i.description || '').toLowerCase().includes(q.toLowerCase()))

  function startPay(inv){
    setPaying(inv)
    setAmount(((inv.balance_cents ?? inv.amount_cents) || 0)/100)
  }

  async function submitPay(e){
    e.preventDefault()
    if (!paying) return
    try{
      await API.post('/payments', {
        invoice_id: paying.id,
        amount: Number(amount),
        method: 'efectivo'
      })
      alert('Cobro registrado')
      setPaying(null)
      setAmount('')
      load()
    }catch(e){ toastError(e) }
  }

  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Facturas" subtitle="Listado de facturas emitidas" />
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="input" placeholder="Buscar..." />
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table">
          <thead>
            <tr><th>#</th><th>Concepto</th><th>Fecha</th><th>Importe</th><th>Estado</th><th>PDF</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i.id}>
                <td>{i.full_number || i.id}</td>
                <td>{i.description || i.notes || '-'}</td>
                <td>{i.issue_date?.slice(0,10) || '-'}</td>
                <td>{((i.amount_cents ?? 0)/100).toFixed(2)} {i.currency || 'EUR'}</td>
                <td>
                  <span className={'badge ' + (i.status==='paid' ? 'badge-paid' : i.status==='partial' ? 'badge-partial' : 'badge-open')}>{i.status}</span>
                </td>
                <td><a className="btn" href={`${API.defaults.baseURL}/invoices/${i.id}/pdf`} target="_blank">Ver PDF</a></td>
                <td><button className="btn btn-xs" onClick={()=>startPay(i)}>Cobrar</button></td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan="7" className="py-6 text-center text-gray-500">Sin datos</td></tr>}
          </tbody>
        </table>
      </div>
      {paying && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <form onSubmit={submitPay} className="bg-white p-6 rounded-xl space-y-3 w-full max-w-sm">
            <h2 className="font-bold text-slate-700">Registrar cobro</h2>
            <p className="text-sm text-slate-500">Factura {paying.full_number || paying.id}</p>
            <div>
              <label className="block text-sm mb-1">Importe</label>
              <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" step="0.01" className="input w-full" required />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={()=>setPaying(null)} className="btn btn-secondary">Cancelar</button>
              <button className="btn">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
