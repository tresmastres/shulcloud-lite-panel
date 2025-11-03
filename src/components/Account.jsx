import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api";

export default function Account() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/members/${id}/account`).then(r => setData(r.data));
  }, [id]);

  if (!data) return <p>Cargando…</p>;

  return (
    <div>
      <h2>Estado de cuenta del miembro #{data.member}</h2>
      {data.invoices.map(i => (
        <div key={i.invoice_id}>
          Factura {i.invoice_id}: {i.amount}€ — Pagado {i.paid}€ — Saldo {i.balance}€ — {i.status}
        </div>
      ))}
    </div>
  );
}
