import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

function safeMoney(v){
  if (typeof v !== 'number') return '0.00'
  return (v/100).toFixed(2)
}

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

  if (!data){
    return <div className="p-6">Cargando...</div>
  }

  const invoices = (data.invoices || []).filter(i => i && (i.invoice_id || i.full_number || i.amount_cents))
  const payments = data.payments || []


  const headerName = (data.full_name || data.name || '') ? `${data.full_name || data.name} (${data.member_id || id})` : `Miembro ${data.member_id || id}`

  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Estado de cuenta" subtitle={headerName} />
      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-sm text-slate-500 mb-3">Saldo total: <strong>{safeMoney(data.total_balance_cents || 0)} EUR</strong></p>
        <table className="w-full table">
          <thead>
            <tr><th>Factura</th><th>Fecha</th><th>Importe</th><th>Pagado</th><th>Saldo</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {invoices.map(i => (
              <tr key={i.invoice_id || i.full_number || i.id}>
                <td>{i.full_number || i.invoice_id || i.id}</td>
                <td>{i.issue_date?.slice(0,10) || '-'}</td>
                <td>{safeMoney(i.amount_cents ?? 0)}</td>
                <td>{safeMoney(i.paid_cents ?? 0)}</td>
                <td>{safeMoney(i.balance_cents ?? 0)}</td>
                <td>{i.status || '-'}</td>
              </tr>
            ))}
            {invoices.length===0 && <tr><td colSpan="6" className="py-6 text-center text-gray-500">Sin facturas</td></tr>}
          </tbody>
        </table>
        <h3 className="mt-6 mb-2 font-semibold">Histórico de cobros</h3>
<table ...>
  {/* recorrer payments */}
</table>

      </div>
    </div>
  )
}
