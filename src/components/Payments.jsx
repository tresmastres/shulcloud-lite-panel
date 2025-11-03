
import { useEffect, useState } from 'react'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

export default function Payments(){
  const [rows, setRows] = useState([])
  const [invoiceId, setInvoiceId] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('efectivo')
  const [banks, setBanks] = useState([])
  const [bankId, setBankId] = useState('')

  async function load(){
    try{
      const r = await API.get('/payments')
      setRows(r.data || [])
      const b = await API.get('/banks').catch(()=>({data:[]}))
      setBanks(b.data || [])
    }catch(e){ toastError(e) }
  }
  useEffect(()=>{ load() }, [])

  async function add(){
    if(!invoiceId || !amount) return
    try{
      await API.post('/payments', {
        invoice_id: Number(invoiceId),
        amount_cents: Math.round(Number(amount)*100),
        metodo: method,
        banco_id: bankId ? Number(bankId) : null
      })
      setInvoiceId(''); setAmount(''); setMethod('efectivo'); setBankId('')
      load()
    }catch(e){ toastError(e) }
  }

  return (
    <div className="space-y-4">
      <SectionTitle title="Cobros" />
      <div className="card grid md:grid-cols-5 gap-3">
        <input className="input" placeholder="ID factura" value={invoiceId} onChange={e=>setInvoiceId(e.target.value)} />
        <input className="input" placeholder="Importe (€)" value={amount} onChange={e=>setAmount(e.target.value)} />
        <select className="select" value={method} onChange={e=>setMethod(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="tpv">TPV</option>
          <option value="transferencia">Transferencia</option>
        </select>
        <select className="select" value={bankId} onChange={e=>setBankId(e.target.value)}>
          <option value="">(Sin banco)</option>
          {banks.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <button className="btn" onClick={add}>Registrar</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full table">
          <thead>
            <tr><th>ID</th><th>Factura</th><th>Fecha</th><th>Importe</th><th>Método</th><th>Banco</th></tr>
          </thead>
          <tbody>
            {(rows || []).map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.invoice_id}</td>
                <td>{p.fecha || p.paid_at?.slice(0,10) || '-'}</td>
                <td>{(p.amount_cents/100).toFixed(2)}</td>
                <td>{p.metodo || p.method}</td>
                <td>{p.banco?.nombre || p.banco_id || '-'}</td>
              </tr>
            ))}
            {(!rows || rows.length===0) && <tr><td colSpan="6" className="py-6 text-center text-gray-500">Sin datos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
