import { useEffect, useState } from "react";
import { API } from "../api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [invoice, setInvoice] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("efectivo");

  const load = async () => {
    const r = await API.get("/payments");
    setPayments(r.data);
  };

  const add = async () => {
    if (!invoice || !amount) return;
    await API.post("/payments", {
      invoice_id: Number(invoice),
      amount_cents: Number(amount) * 100,
      metodo: method,
    });
    setInvoice(""); setAmount("");
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Cobros</h2>
      <input placeholder="ID factura" value={invoice} onChange={e => setInvoice(e.target.value)} />
      <input placeholder="Importe (€)" value={amount} onChange={e => setAmount(e.target.value)} />
      <select value={method} onChange={e => setMethod(e.target.value)}>
        <option value="efectivo">Efectivo</option>
        <option value="tpv">TPV</option>
        <option value="transferencia">Transferencia</option>
      </select>
      <button onClick={add}>Registrar</button>
      <ul>
        {payments.map(p => (
          <li key={p.id}>
            Factura {p.invoice_id} — {p.amount_cents / 100}€ — {p.metodo}
          </li>
        ))}
      </ul>
    </div>
  );
}
