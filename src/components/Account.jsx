
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

export default function Account(){
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{
    async function fetchIt(){
      try{
        const r = await API.get(`/members/${id}/account`)
        setData(r.data)
      }catch(e){ toastError(e) }
    }
    fetchIt()
  }, [id])

  if(!data) return <p>Cargando…</p>

  const total = (data.total_balance_cents || 0)/100

  return (
    <div className="space-y-4">
      <SectionTitle title={`Estado de cuenta — Miembro #${data.member_id || id}`} />
      <div className="card">
        <div className="text-sm text-gray-600 mb-2">Saldo total pendiente</div>
        <div className="text-3xl font-semibold">{total.toFixed(2)} EUR</div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full table">
          <thead>
            <tr><th>Factura</th><th>Fecha</th><th>Importe</th><th>Pagado</th><th>Saldo</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {data.invoices?.map(i => (
              <tr key={i.invoice_id}>
                <td>{i.full_number || i.invoice_id}</td>
                <td>{i.issue_date?.slice(0,10) || '-'}</td>
                <td>{(i.amount_cents/100).toFixed(2)}</td>
                <td>{(i.paid_cents/100).toFixed(2)}</td>
                <td>{(i.balance_cents/100).toFixed(2)}</td>
                <td>{i.status}</td>
              </tr>
            ))}
            {(!data.invoices || data.invoices.length===0) && <tr><td colSpan="6" className="py-6 text-center text-gray-500">Sin facturas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
