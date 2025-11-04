import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API, toastError } from '../api'
import SectionTitle from './SectionTitle'

function money(v){
  if (typeof v !== 'number') return '0.00'
  return (v / 100).toFixed(2)
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

  const invoices = (data.invoices || []).filter(i => i)
  const payments = (data.payments || []).filter(p => p)

  const headerName = (data.full_name || data.name)
    ? `${data.full_name || data.name} (${data.member_id || id})`
    : `Miembro ${data.member_id || id}`

  return (
    <div className="p-6 space-y-6">
      <SectionTitle title="Estado de cuenta" subtitle={headerName} />

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-sm text-slate-500 mb-3">
          Saldo total:{' '}
          <strong>{money(data.total_balance_cents || 0)} EUR</strong>
        </p>

        <h3 className="font-semibold mb-2">Facturas</h3>
        <table className="w-full table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Fecha</th>
              <th>Importe</th>
              <th>Pagado</th>
              <th>Saldo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? invoices.map(i => (
              <tr key={i.invoice_id || i.full_number || i.id}>
                <td>{i.full_number || i.invoice_id || i.id}</td>
                <td>{i.issue_date?.slice(0,10) || '-'}</td>
                <td>{money(i.amount_cents ?? 0)}</td>
                <td>{money(i.paid_cents ?? 0)}</td>
                <td>{money(i.balance_cents ?? 0)}</td>
                <td>{i.status || '-'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  Sin facturas
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="font-semibold mb-2 mt-6">Histórico de cobros</h3>
        <table className="w-full table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Factura</th>
              <th>Importe</th>
              <th>Método</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? payments.map(p => (
              <tr key={p.id}>
                <td>{p.paid_at?.slice(0,10) || p.fecha?.slice(0,10) || '-'}</td>
                <td>{p.invoice_id || '-'}</td>
                <td>{money(p.amount_cents ?? 0)}</td>
                <td>{p.method || p.metodo || '-'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  Sin cobros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

